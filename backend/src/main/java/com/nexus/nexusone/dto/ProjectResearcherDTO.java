package com.nexus.nexusone.dto;

import com.nexus.nexusone.model.ProjectResearcher;
import com.nexus.nexusone.model.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResearcherDTO {
    private Long userId;
    private UserDTO user;
    private ProjectRole role;
    private LocalDateTime assignedAt;

    public static ProjectResearcherDTO fromEntity(ProjectResearcher researcher) {
        ProjectResearcherDTO dto = new ProjectResearcherDTO();
        dto.setUserId(researcher.getUser() != null ? researcher.getUser().getId() : null);
        dto.setUser(researcher.getUser() != null ? UserDTO.fromEntity(researcher.getUser()) : null);
        dto.setRole(researcher.getRole());
        dto.setAssignedAt(researcher.getAssignedAt());
        return dto;
    }
}
