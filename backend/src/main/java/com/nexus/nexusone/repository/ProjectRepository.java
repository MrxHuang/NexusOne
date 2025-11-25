package com.nexus.nexusone.repository;

import com.nexus.nexusone.model.Project;
import com.nexus.nexusone.model.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);

    List<Project> findByCreatedById(Long userId);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.researchers pr WHERE pr.user.id = :userId")
    List<Project> findByResearcherUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = :status")
    long countByStatus(@Param("status") ProjectStatus status);
}
