package com.nexus.nexusone.service;

import com.nexus.nexusone.model.Activity;
import com.nexus.nexusone.model.Evaluation;
import com.nexus.nexusone.model.Project;
import com.nexus.nexusone.model.enums.ProjectStatus;
import com.nexus.nexusone.model.enums.EvaluationStatus;
import com.nexus.nexusone.repository.EvaluationRepository;
import com.nexus.nexusone.repository.ProjectRepository;
import com.nexus.nexusone.repository.ProjectResearcherRepository;
import com.nexus.nexusone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

        @Autowired
        private ProjectRepository projectRepository;

        @Autowired
        private EvaluationRepository evaluationRepository;

        @Autowired
        private ProjectResearcherRepository researcherRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ActivityService activityService;

        // ADMIN DASHBOARD
        @Transactional(readOnly = true)
        public Map<String, Object> getAdminDashboard() {
                Map<String, Object> dashboard = new HashMap<>();

                // Total counts
                long totalProjects = projectRepository.count();
                long totalUsers = userRepository.count();
                long totalEvaluations = evaluationRepository.count();

                dashboard.put("totalProjects", totalProjects);
                dashboard.put("totalUsers", totalUsers);
                dashboard.put("totalEvaluations", totalEvaluations);

                // Projects by status
                Map<String, Long> projectsByStatus = new HashMap<>();
                projectsByStatus.put("DRAFT", projectRepository.countByStatus(ProjectStatus.DRAFT));
                projectsByStatus.put("IN_REVIEW", projectRepository.countByStatus(ProjectStatus.IN_REVIEW));
                projectsByStatus.put("ACTIVE", projectRepository.countByStatus(ProjectStatus.ACTIVE));
                projectsByStatus.put("COMPLETED", projectRepository.countByStatus(ProjectStatus.COMPLETED));
                projectsByStatus.put("SUSPENDED", projectRepository.countByStatus(ProjectStatus.SUSPENDED));
                dashboard.put("projectsByStatus", projectsByStatus);

                // Evaluations stats
                long pendingEvaluations = evaluationRepository.findAll().stream()
                                .filter(e -> e.getStatus() == EvaluationStatus.PENDING)
                                .count();
                long completedEvaluations = evaluationRepository.findAll().stream()
                                .filter(e -> e.getStatus() == EvaluationStatus.COMPLETED)
                                .count();

                dashboard.put("pendingEvaluations", pendingEvaluations);
                dashboard.put("completedEvaluations", completedEvaluations);

                // Recent activities (system-wide)
                List<Activity> recentActivities = activityService.getRecentActivity();
                dashboard.put("recentActivities", recentActivities);

                return dashboard;
        }

        // EVALUATOR DASHBOARD
        @Transactional(readOnly = true)
        public Map<String, Object> getEvaluatorDashboard(String userId) {
                Map<String, Object> dashboard = new HashMap<>();

                // Convert String userId to Long
                Long userIdLong = Long.parseLong(userId);

                // My evaluations
                List<Evaluation> myEvaluations = evaluationRepository.findByEvaluatorId(userIdLong);

                long pendingCount = myEvaluations.stream()
                                .filter(e -> e.getStatus() == EvaluationStatus.PENDING)
                                .count();

                long completedCount = myEvaluations.stream()
                                .filter(e -> e.getStatus() == EvaluationStatus.COMPLETED)
                                .count();

                dashboard.put("totalEvaluations", myEvaluations.size());
                dashboard.put("pendingEvaluations", pendingCount);
                dashboard.put("completedEvaluations", completedCount);

                // Pending evaluations list
                List<Map<String, Object>> pendingEvaluations = myEvaluations.stream()
                                .filter(e -> e.getStatus() == EvaluationStatus.PENDING)
                                .limit(5)
                                .map(e -> {
                                        Map<String, Object> evalMap = new HashMap<>();
                                        evalMap.put("id", e.getId());
                                        evalMap.put("projectId", e.getProject().getId());
                                        evalMap.put("projectTitle", e.getProject().getTitle());
                                        evalMap.put("submittedAt", e.getSubmittedAt());
                                        return evalMap;
                                })
                                .collect(Collectors.toList());

                dashboard.put("pendingEvaluationsList", pendingEvaluations);

                // Recent evaluation activity
                List<Activity> recentActivities = activityService.getRecentActivity().stream()
                                .filter(a -> userIdLong.equals(a.getUserId()))
                                .limit(10)
                                .collect(Collectors.toList());
                dashboard.put("recentActivities", recentActivities);

                return dashboard;
        }

        // RESEARCHER DASHBOARD
        @Transactional(readOnly = true)
        public Map<String, Object> getResearcherDashboard(String userId) {
                Map<String, Object> dashboard = new HashMap<>();

                // Convert String userId to Long
                Long userIdLong = Long.parseLong(userId);

                // My projects
                List<Project> myProjects = researcherRepository.findByUserId(userIdLong).stream()
                                .map(pr -> pr.getProject())
                                .collect(Collectors.toList());

                dashboard.put("totalProjects", myProjects.size());

                // Projects by status
                Map<String, Long> projectsByStatus = new HashMap<>();
                projectsByStatus.put("DRAFT",
                                myProjects.stream().filter(p -> p.getStatus() == ProjectStatus.DRAFT).count());
                projectsByStatus.put("IN_REVIEW",
                                myProjects.stream().filter(p -> p.getStatus() == ProjectStatus.IN_REVIEW).count());
                projectsByStatus.put("ACTIVE",
                                myProjects.stream().filter(p -> p.getStatus() == ProjectStatus.ACTIVE).count());
                projectsByStatus.put("COMPLETED",
                                myProjects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count());
                projectsByStatus.put("SUSPENDED",
                                myProjects.stream().filter(p -> p.getStatus() == ProjectStatus.SUSPENDED).count());
                dashboard.put("projectsByStatus", projectsByStatus);

                // Active projects list
                List<Map<String, Object>> activeProjects = myProjects.stream()
                                .filter(p -> p.getStatus() == ProjectStatus.ACTIVE)
                                .limit(5)
                                .map(p -> {
                                        Map<String, Object> projectMap = new HashMap<>();
                                        projectMap.put("id", p.getId());
                                        projectMap.put("title", p.getTitle());
                                        projectMap.put("status", p.getStatus());
                                        projectMap.put("startDate", p.getStartDate());
                                        projectMap.put("endDate", p.getEndDate());
                                        return projectMap;
                                })
                                .collect(Collectors.toList());

                dashboard.put("activeProjectsList", activeProjects);

                // Team members count (unique across all projects)
                long teamMembersCount = myProjects.stream()
                                .flatMap(p -> p.getResearchers().stream())
                                .map(pr -> pr.getUserId())
                                .distinct()
                                .count();
                dashboard.put("teamMembersCount", teamMembersCount);

                // Recent activities
                List<Activity> recentActivities = activityService.getRecentActivity().stream()
                                .filter(a -> userIdLong.equals(a.getUserId()))
                                .limit(10)
                                .collect(Collectors.toList());
                dashboard.put("recentActivities", recentActivities);

                return dashboard;
        }

        // Legacy methods for backward compatibility
        @Transactional(readOnly = true)
        @Cacheable(value = "dashboard-metrics")
        public Map<String, Object> getMetrics(Long userId) {
                Map<String, Object> metrics = new HashMap<>();

                long totalProjects = projectRepository.count();
                long activeProjects = projectRepository.countByStatus(ProjectStatus.ACTIVE);
                long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);

                metrics.put("totalProjects", totalProjects);
                metrics.put("activeProjects", activeProjects);
                metrics.put("completedProjects", completedProjects);

                // Projects by status
                Map<String, Long> projectsByStatus = new HashMap<>();
                projectsByStatus.put("DRAFT", projectRepository.countByStatus(ProjectStatus.DRAFT));
                projectsByStatus.put("IN_REVIEW", projectRepository.countByStatus(ProjectStatus.IN_REVIEW));
                projectsByStatus.put("ACTIVE", activeProjects);
                projectsByStatus.put("COMPLETED", completedProjects);
                projectsByStatus.put("SUSPENDED", projectRepository.countByStatus(ProjectStatus.SUSPENDED));
                metrics.put("projectsByStatus", projectsByStatus);

                // User-specific metrics
                long myProjects = researcherRepository.findByUserId(userId).size();
                metrics.put("myProjectsCount", myProjects);

                long pendingEvaluations = evaluationRepository.findByEvaluatorId(userId).stream()
                                .filter(e -> e.getStatus() == EvaluationStatus.PENDING)
                                .count();
                metrics.put("pendingEvaluations", pendingEvaluations);

                return metrics;
        }

        @Transactional(readOnly = true)
        public List<Activity> getRecentActivity() {
                return activityService.getRecentActivity();
        }

        @Transactional(readOnly = true)
        public Map<String, Object> getPersonalStats(Long userId) {
                Map<String, Object> stats = new HashMap<>();

                long projectsInvolved = researcherRepository.findByUserId(userId).size();
                long evaluationsCompleted = evaluationRepository.findByEvaluatorId(userId).stream()
                                .filter(e -> e.getStatus() == EvaluationStatus.COMPLETED)
                                .count();

                stats.put("projectsInvolved", projectsInvolved);
                stats.put("evaluationsCompleted", evaluationsCompleted);

                return stats;
        }
}
