package com.nexus.nexusone.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.nexus.nexusone.model.Evaluation;
import com.nexus.nexusone.model.Project;
import com.nexus.nexusone.model.ProjectResearcher;
import com.nexus.nexusone.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Service
public class PdfService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private EvaluationService evaluationService;

    public byte[] generateProjectReport(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Title
            document.add(new Paragraph("Project Report")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("\n"));

            // Project details
            document.add(new Paragraph("Title: " + project.getTitle()).setBold());
            document.add(new Paragraph("Status: " + project.getStatus()));
            document.add(new Paragraph("Start Date: " + project.getStartDate()));
            document.add(new Paragraph("End Date: " + project.getEndDate()));
            document.add(new Paragraph("\nDescription:"));
            document.add(new Paragraph(project.getDescription()));
            document.add(new Paragraph("\nObjectives:"));
            document.add(new Paragraph(project.getObjectives()));

            // Researchers
            document.add(new Paragraph("\nResearch Team:").setBold());
            Table table = new Table(2);
            table.addCell("Name");
            table.addCell("Role");

            for (ProjectResearcher researcher : project.getResearchers()) {
                table.addCell(researcher.getUser().getName());
                table.addCell(researcher.getRole().toString());
            }
            document.add(table);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    public byte[] generateEvaluationReport(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<Evaluation> evaluations = evaluationService.getEvaluationsByProject(projectId);
        Map<String, Object> results = evaluationService.getEvaluationResults(projectId);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Title
            document.add(new Paragraph("Evaluation Report")
                    .setFontSize(20)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Project: " + project.getTitle()).setBold());
            document.add(new Paragraph("Total Evaluations: " + evaluations.size()));

            if (results.containsKey("averageScore")) {
                document.add(new Paragraph("Average Score: " +
                        String.format("%.2f", results.get("averageScore"))));
            }

            document.add(new Paragraph("\nEvaluations:").setBold());

            for (Evaluation eval : evaluations) {
                document.add(new Paragraph("\nEvaluator: " + eval.getEvaluator().getName()));
                document.add(new Paragraph("Recommendation: " + eval.getRecommendation()));
                document.add(new Paragraph("Comment: " + eval.getOverallComment()));
                document.add(new Paragraph("---"));
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
