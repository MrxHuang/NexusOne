package com.nexus.nexusone.service;

import com.nexus.nexusone.dto.AssignResearcherRequest;
import com.nexus.nexusone.model.*;
import com.nexus.nexusone.model.enums.ActivityType;
import com.nexus.nexusone.model.enums.ProjectStatus;
import com.nexus.nexusone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectResearcherRepository researcherRepository;

    @Autowired
    private ProjectVersionRepository versionRepository;

    @Autowired
    private ActivityService activityService;

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public Project createProject(Project project, Long userId) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.setCreatedBy(creator);
        project.setStatus(ProjectStatus.DRAFT);
        Project savedProject = projectRepository.save(project);

        // Create initial version
        ProjectVersion version = new ProjectVersion();
        version.setProject(savedProject);
        version.setVersionNumber("1.0");
        version.setChanges("Initial project creation");
        version.setModifiedBy(creator);
        versionRepository.save(version);

        // Log activity
        activityService.logActivity(
                ActivityType.PROJECT_CREATED,
                "Created project \"" + project.getTitle() + "\"",
                savedProject,
                creator);

        return savedProject;
    }

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public Project updateProject(Long projectId, Project updatedProject, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User modifier = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Track changes
        StringBuilder changes = new StringBuilder();
        if (!project.getTitle().equals(updatedProject.getTitle())) {
            changes.append("Title updated. ");
        }
        if (!project.getDescription().equals(updatedProject.getDescription())) {
            changes.append("Description updated. ");
        }
        if (project.getStatus() != updatedProject.getStatus()) {
            changes.append("Status changed to ").append(updatedProject.getStatus()).append(". ");
        }

        // Update fields
        project.setTitle(updatedProject.getTitle());
        project.setDescription(updatedProject.getDescription());
        project.setObjectives(updatedProject.getObjectives());
        project.setStartDate(updatedProject.getStartDate());
        project.setEndDate(updatedProject.getEndDate());
        project.setStatus(updatedProject.getStatus());
        project.setBudget(updatedProject.getBudget());
        project.setTags(updatedProject.getTags());

        Project saved = projectRepository.save(project);

        // Create version entry
        List<ProjectVersion> versions = versionRepository.findByProjectIdOrderByModifiedAtDesc(projectId);
        String newVersion = incrementVersion(versions.isEmpty() ? "1.0" : versions.get(0).getVersionNumber());

        ProjectVersion version = new ProjectVersion();
        version.setProject(saved);
        version.setVersionNumber(newVersion);
        version.setChanges(changes.toString());
        version.setModifiedBy(modifier);
        versionRepository.save(version);

        // Log activity
        activityService.logActivity(
                ActivityType.PROJECT_UPDATED,
                "Updated project \"" + project.getTitle() + "\"",
                saved,
                modifier);

        return saved;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "projects")
    public List<Project> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        projects.forEach(p -> p.getTags().size());
        return projects;
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.getTags().size();
        return project;
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByStatus(ProjectStatus status) {
        List<Project> projects = projectRepository.findByStatus(status);
        projects.forEach(p -> p.getTags().size());
        return projects;
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByCreator(Long userId) {
        List<Project> projects = projectRepository.findByCreatedById(userId);
        projects.forEach(p -> p.getTags().size());
        return projects;
    }

    @Transactional(readOnly = true)
    public List<Project> getProjectsByResearcher(Long userId) {
        List<Project> projects = projectRepository.findByResearcherUserId(userId);
        projects.forEach(p -> p.getTags().size());
        return projects;
    }

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public void assignResearcher(Long projectId, AssignResearcherRequest request, Long assignedBy) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User researcher = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User assigner = userRepository.findById(assignedBy)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already assigned
        if (researcherRepository.findByProjectIdAndUserId(projectId, request.getUserId()).isPresent()) {
            throw new RuntimeException("Researcher already assigned to this project");
        }

        ProjectResearcher projectResearcher = new ProjectResearcher();
        projectResearcher.setProject(project);
        projectResearcher.setUser(researcher);
        projectResearcher.setRole(request.getRole());

        researcherRepository.save(projectResearcher);

        // Log activity
        activityService.logActivity(
                ActivityType.PROJECT_UPDATED,
                "Assigned " + researcher.getName() + " as " + request.getRole() + " to project",
                project,
                assigner);
    }

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public void removeResearcher(Long projectId, Long userId, Long removedBy) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User remover = userRepository.findById(removedBy)
                .orElseThrow(() -> new RuntimeException("User not found"));

        researcherRepository.deleteByProjectIdAndUserId(projectId, userId);

        // Log activity
        activityService.logActivity(
                ActivityType.PROJECT_UPDATED,
                "Removed researcher from project",
                project,
                remover);
    }

    @Transactional(readOnly = true)
    public List<ProjectVersion> getProjectVersions(Long projectId) {
        return versionRepository.findByProjectIdOrderByModifiedAtDesc(projectId);
    }

    @Transactional
    @CacheEvict(value = "projects", allEntries = true)
    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }

    private String incrementVersion(String version) {
        String[] parts = version.split("\\.");
        int minor = Integer.parseInt(parts[1]) + 1;
        return parts[0] + "." + minor;
    }
}
