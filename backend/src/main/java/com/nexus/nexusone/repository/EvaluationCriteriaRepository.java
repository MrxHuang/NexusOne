package com.nexus.nexusone.repository;

import com.nexus.nexusone.model.EvaluationCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EvaluationCriteriaRepository extends JpaRepository<EvaluationCriteria, Long> {
    Optional<EvaluationCriteria> findByCriteriaId(String criteriaId);
}
