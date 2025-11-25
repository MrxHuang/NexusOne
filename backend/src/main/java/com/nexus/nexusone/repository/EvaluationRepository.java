package com.nexus.nexusone.repository;

import com.nexus.nexusone.model.Evaluation;
import com.nexus.nexusone.model.enums.EvaluationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByProject_Id(Long projectId);
    List<Evaluation> findByEvaluator_Id(Long evaluatorId);
    List<Evaluation> findByStatus(EvaluationStatus status);
    List<Evaluation> findByProject_IdAndStatus(Long projectId, EvaluationStatus status);
}
