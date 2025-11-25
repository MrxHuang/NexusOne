package com.nexus.nexusone.controller;

import com.nexus.nexusone.model.Evaluation;
import com.nexus.nexusone.service.EvaluationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "http://localhost:4200")
public class EvaluationController {

    @Autowired
    private EvaluationService evaluationService;

    @PostMapping
    public ResponseEntity<Evaluation> submitEvaluation(@Valid @RequestBody Evaluation evaluation,
            Authentication authentication) {
        Long evaluatorId = (Long) authentication.getPrincipal();
        Evaluation submitted = evaluationService.submitEvaluation(evaluation, evaluatorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(submitted);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Evaluation>> getProjectEvaluations(@PathVariable Long projectId) {
        List<Evaluation> evaluations = evaluationService.getEvaluationsByProject(projectId);
        return ResponseEntity.ok(evaluations);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Evaluation>> getMyEvaluations(Authentication authentication) {
        Long evaluatorId = (Long) authentication.getPrincipal();
        List<Evaluation> evaluations = evaluationService.getMyEvaluations(evaluatorId);
        return ResponseEntity.ok(evaluations);
    }

    @GetMapping
    public ResponseEntity<List<Evaluation>> getAllEvaluations() {
        List<Evaluation> evaluations = evaluationService.getAllEvaluations();
        return ResponseEntity.ok(evaluations);
    }

    @GetMapping("/results/{projectId}")
    public ResponseEntity<Map<String, Object>> getEvaluationResults(@PathVariable Long projectId) {
        Map<String, Object> results = evaluationService.getEvaluationResults(projectId);
        return ResponseEntity.ok(results);
    }
}
