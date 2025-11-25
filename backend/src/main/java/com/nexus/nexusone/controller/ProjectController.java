package com.nexus.nexusone.controller;

import com.nexus.nexusone.dto.AssignResearcherRequest;
import com.nexus.nexusone.dto.ProjectDTO;
import com.nexus.nexusone.model.Project;
import com.nexus.nexusone.model.ProjectVersion;
import com.nexus.nexusone.model.enums.ProjectStatus;
import com.nexus.nexusone.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody Project project,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        Project created = projectService.createProject(project, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProjectDTO.fromEntity(created));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects(
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String filter) {

        if (status != null) {
            return ResponseEntity.ok(
                    projectService.getProjectsByStatus(status).stream()
                            .map(ProjectDTO::fromEntity)
                            .collect(Collectors.toList()));
        }

        return ResponseEntity.ok(
                projectService.getAllProjects().stream()
                        .map(ProjectDTO::fromEntity)
                        .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(ProjectDTO.fromEntity(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id,
            @Valid @RequestBody Project project,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        Project updated = projectService.updateProject(id, project, userId);
        return ResponseEntity.ok(ProjectDTO.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/researchers")
    public ResponseEntity<Void> assignResearcher(@PathVariable Long id,
            @Valid @RequestBody AssignResearcherRequest request,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        projectService.assignResearcher(id, request, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/researchers/{userId}")
    public ResponseEntity<Void> removeResearcher(@PathVariable Long id,
            @PathVariable Long userId,
            Authentication authentication) {
        Long removedBy = (Long) authentication.getPrincipal();
        projectService.removeResearcher(id, userId, removedBy);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<List<ProjectVersion>> getProjectVersions(@PathVariable Long id) {
        List<ProjectVersion> versions = projectService.getProjectVersions(id);
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectDTO>> getMyProjects(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        List<Project> projects = projectService.getProjectsByResearcher(userId);
        return ResponseEntity.ok(
                projects.stream()
                        .map(ProjectDTO::fromEntity)
                        .collect(Collectors.toList()));
    }
}
