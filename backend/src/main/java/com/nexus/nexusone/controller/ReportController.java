package com.nexus.nexusone.controller;

import com.nexus.nexusone.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200")
public class ReportController {

    @Autowired
    private PdfService pdfService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<byte[]> downloadProjectReport(@PathVariable Long projectId) {
        byte[] pdfBytes = pdfService.generateProjectReport(projectId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "project-report-" + projectId + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/evaluation/{projectId}")
    public ResponseEntity<byte[]> downloadEvaluationReport(@PathVariable Long projectId) {
        byte[] pdfBytes = pdfService.generateEvaluationReport(projectId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "evaluation-report-" + projectId + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
