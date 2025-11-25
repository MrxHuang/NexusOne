package com.nexus.nexusone.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nexus.nexusone.model.Evaluation;
import com.nexus.nexusone.model.Project;
import com.nexus.nexusone.model.User;
import com.nexus.nexusone.model.enums.ActivityType;
import com.nexus.nexusone.model.enums.EvaluationStatus;
import com.nexus.nexusone.model.enums.Recommendation;
import com.nexus.nexusone.repository.EvaluationRepository;
import com.nexus.nexusone.repository.ProjectRepository;
import com.nexus.nexusone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public Evaluation submitEvaluation(Evaluation evaluation, Long evaluatorId) {
        User evaluator = userRepository.findById(evaluatorId)
                .orElseThrow(() -> new RuntimeException("Evaluator not found"));

        Project project = projectRepository.findById(evaluation.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        evaluation.setEvaluator(evaluator);
        evaluation.setProject(project);
        evaluation.setStatus(EvaluationStatus.COMPLETED);

        Evaluation saved = evaluationRepository.save(evaluation);

        // Log activity
        activityService.logActivity(
                ActivityType.EVALUATION_SUBMITTED,
                "Submitted evaluation for project \"" + project.getTitle() + "\"",
                project,
                evaluator);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Evaluation> getEvaluationsByProject(Long projectId) {
        return evaluationRepository.findByProject_Id(projectId);
    }

    @Transactional(readOnly = true)
    public List<Evaluation> getMyEvaluations(Long evaluatorId) {
        return evaluationRepository.findByEvaluator_Id(evaluatorId);
    }

    @Transactional(readOnly = true)
    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getEvaluationResults(Long projectId) {
        List<Evaluation> evaluations = evaluationRepository.findByProject_IdAndStatus(
                projectId, EvaluationStatus.COMPLETED);

        if (evaluations.isEmpty()) {
            return new HashMap<>();
        }

        Map<String, Object> results = new HashMap<>();
        results.put("projectId", projectId);
        results.put("evaluatorCount", evaluations.size());

        // Calculate average scores
        Map<String, Double> criteriaAverages = new HashMap<>();
        double totalScore = 0;
        int scoreCount = 0;

        for (Evaluation eval : evaluations) {
            try {
                List<Map<String, Object>> scores = objectMapper.readValue(
                        eval.getScores(),
                        new TypeReference<List<Map<String, Object>>>() {
                        });

                for (Map<String, Object> score : scores) {
                    String criteriaId = (String) score.get("criteriaId");
                    Number scoreValue = (Number) score.get("score");

                    if (scoreValue != null) {
                        double value = scoreValue.doubleValue();
                        criteriaAverages.merge(criteriaId, value, (a, b) -> a + b);
                        totalScore += value;
                        scoreCount++;
                    }
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error parsing evaluation scores", e);
            }
        }

        // Calculate averages
        criteriaAverages.replaceAll((k, v) -> v / evaluations.size());
        results.put("criteriaAverages", criteriaAverages);
        results.put("averageScore", scoreCount > 0 ? totalScore / scoreCount : 0);

        // Count recommendations
        Map<String, Long> recommendations = new HashMap<>();
        recommendations.put("approve",
                evaluations.stream().filter(e -> e.getRecommendation() == Recommendation.APPROVE).count());
        recommendations.put("reject",
                evaluations.stream().filter(e -> e.getRecommendation() == Recommendation.REJECT).count());
        recommendations.put("revise",
                evaluations.stream().filter(e -> e.getRecommendation() == Recommendation.REVISE).count());
        results.put("recommendations", recommendations);

        return results;
    }
}
