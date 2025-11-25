package com.nexus.nexusone.repository;

import com.nexus.nexusone.model.Evaluation;
import com.nexus.nexusone.model.enums.EvaluationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByProjectId(Long projectId);
    List<Evaluation> findByEvaluatorId(Long evaluatorId);
    List<Evaluation> findByStatus(EvaluationStatus status);
    List<Evaluation> findByProjectIdAndStatus(Long projectId, EvaluationStatus status);
}
