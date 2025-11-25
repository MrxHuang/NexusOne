package com.nexus.nexusone.config;

import com.nexus.nexusone.model.EvaluationCriteria;
import com.nexus.nexusone.repository.EvaluationCriteriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EvaluationCriteriaRepository criteriaRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize default evaluation criteria if not exists
        if (criteriaRepository.count() == 0) {
            criteriaRepository.save(new EvaluationCriteria(null, "innovation", "Innovation",
                    "Originality and novelty of the research proposal", 10));
            criteriaRepository.save(new EvaluationCriteria(null, "methodology", "Methodology",
                    "Soundness and appropriateness of the research methods", 10));
            criteriaRepository.save(new EvaluationCriteria(null, "feasibility", "Feasibility",
                    "Realistic timeline and resource allocation", 10));
            criteriaRepository.save(new EvaluationCriteria(null, "impact", "Impact",
                    "Potential contribution to the field and society", 10));
            criteriaRepository.save(new EvaluationCriteria(null, "team", "Team Capability",
                    "Expertise and track record of the research team", 10));
        }
    }
}
