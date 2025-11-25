package com.nexus.nexusone.service;

import com.nexus.nexusone.model.Activity;
import com.nexus.nexusone.model.Project;
import com.nexus.nexusone.model.User;
import com.nexus.nexusone.model.enums.ActivityType;
import com.nexus.nexusone.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Transactional
    public void logActivity(ActivityType type, String description, Project project, User user) {
        Activity activity = new Activity();
        activity.setType(type);
        activity.setDescription(description);
        activity.setProject(project);
        activity.setUser(user);
        activity.setUserName(user.getName());

        activityRepository.save(activity);
    }

    @Transactional(readOnly = true)
    public List<Activity> getRecentActivity() {
        return activityRepository.findTop20ByOrderByTimestampDesc();
    }

    @Transactional(readOnly = true)
    public List<Activity> getUserActivity(Long userId) {
        return activityRepository.findByUserIdOrderByTimestampDesc(userId);
    }
}
