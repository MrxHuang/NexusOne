package com.nexus.nexusone.repository;

import com.nexus.nexusone.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findTop20ByOrderByTimestampDesc();

    List<Activity> findByUserIdOrderByTimestampDesc(Long userId);
}
