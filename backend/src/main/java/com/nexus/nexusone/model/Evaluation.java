package com.nexus.nexusone.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nexus.nexusone.model.enums.EvaluationStatus;
import com.nexus.nexusone.model.enums.Recommendation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @Column(columnDefinition = "JSON")
    private String scores; // JSON array of {criteriaId, score, comment}

    @Column(columnDefinition = "TEXT")
    private String overallComment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Recommendation recommendation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvaluationStatus status = EvaluationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    // Expose IDs for JSON serialization
    @JsonProperty("projectId")
    public Long getProjectId() {
        return project != null ? project.getId() : null;
    }

    @JsonProperty("evaluatorId")
    public Long getEvaluatorId() {
        return evaluator != null ? evaluator.getId() : null;
    }

    @JsonProperty("projectTitle")
    public String getProjectTitle() {
        return project != null ? project.getTitle() : null;
    }
}
