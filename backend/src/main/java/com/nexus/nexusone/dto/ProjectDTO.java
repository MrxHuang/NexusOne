package com.nexus.nexusone.dto;

import com.nexus.nexusone.model.Project;
import com.nexus.nexusone.model.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private String objectives;
    private String notes;
    private String methodology;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatus status;
    private BigDecimal budget;
    private List<String> tags;
    private List<String> attachments;
    private Long createdBy; // Just the ID
    private List<ProjectResearcherDTO> researchers;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectDTO fromEntity(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setObjectives(project.getObjectives());
        dto.setNotes(project.getNotes());
        dto.setMethodology(project.getMethodology());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setStatus(project.getStatus());
        dto.setBudget(project.getBudget());
        dto.setTags(project.getTags());
        dto.setAttachments(project.getAttachments());
        dto.setCreatedBy(project.getCreatedBy() != null ? project.getCreatedBy().getId() : null);
        dto.setResearchers(
                project.getResearchers() == null
                        ? List.of()
                        : project.getResearchers().stream()
                                .map(ProjectResearcherDTO::fromEntity)
                                .collect(Collectors.toList()));
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }
}
