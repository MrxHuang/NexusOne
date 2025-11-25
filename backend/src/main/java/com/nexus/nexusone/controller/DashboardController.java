package com.nexus.nexusone.controller;

import com.nexus.nexusone.model.Activity;
import com.nexus.nexusone.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private com.nexus.nexusone.repository.UserRepository userRepository;

    // Role-specific dashboard endpoints
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> dashboard = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/evaluator")
    public ResponseEntity<Map<String, Object>> getEvaluatorDashboard(Authentication authentication) {
        String userEmail = authentication.getName();
        // Get user ID from email
        return userRepository.findByEmail(userEmail)
                .map(user -> {
                    Map<String, Object> dashboard = dashboardService.getEvaluatorDashboard(user.getId().toString());
                    return ResponseEntity.ok(dashboard);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/researcher")
    public ResponseEntity<Map<String, Object>> getResearcherDashboard(Authentication authentication) {
        String userEmail = authentication.getName();
        // Get user ID from email
        return userRepository.findByEmail(userEmail)
                .map(user -> {
                    Map<String, Object> dashboard = dashboardService.getResearcherDashboard(user.getId().toString());
                    return ResponseEntity.ok(dashboard);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    // Legacy endpoints for backward compatibility
    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        Map<String, Object> metrics = dashboardService.getMetrics(userId);
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/activity")
    public ResponseEntity<List<Activity>> getRecentActivity() {
        List<Activity> activities = dashboardService.getRecentActivity();
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPersonalStats(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        Map<String, Object> stats = dashboardService.getPersonalStats(userId);
        return ResponseEntity.ok(stats);
    }
}
