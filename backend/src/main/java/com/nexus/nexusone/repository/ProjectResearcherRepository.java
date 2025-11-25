package com.nexus.nexusone.repository;

import com.nexus.nexusone.model.ProjectResearcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectResearcherRepository extends JpaRepository<ProjectResearcher, Long> {
    List<ProjectResearcher> findByProjectId(Long projectId);

    List<ProjectResearcher> findByUserId(Long userId);

    Optional<ProjectResearcher> findByProjectIdAndUserId(Long projectId, Long userId);

    void deleteByProjectIdAndUserId(Long projectId, Long userId);
}
