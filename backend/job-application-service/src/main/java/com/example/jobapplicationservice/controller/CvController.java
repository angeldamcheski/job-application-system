package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.model.Cv;
import com.example.jobapplicationservice.service.CvService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/cv")
public class CvController {
    private final CvService cvService;

    public CvController(CvService cvService) {
        this.cvService = cvService;
    }

    @PostMapping("/upload/{applicantId}")
    public ResponseEntity<Cv> uploadCv(@PathVariable Long applicantId, @RequestParam("file") MultipartFile file) throws IOException {
        Cv cv = cvService.uploadCv(applicantId, file);
        return ResponseEntity.ok(cv);
    }

    @GetMapping("/user/{applicantId}")
    public ResponseEntity<Cv> getUserCv(@PathVariable Long applicantId) {
        Cv cv = cvService.getUserCv(applicantId);
        return ResponseEntity.ok(cv);
    }

//    @GetMapping("/download/{cvId}")
//    public ResponseEntity<Resource> downloadCv(@PathVariable Long cvId) throws MalformedURLException {
//        Cv cv = cvService.getUserCv(cvId);
//        Path path = Paths.get(cv.getFilePath());
//        Resource resource = new UrlResource(path.toUri());
//        return ResponseEntity.ok()
//                .contentType(MediaType.APPLICATION_PDF)
//                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + cv.getFileName() + "\"")
//                .body(resource);
//    }
    @GetMapping("/download/{cvId}")
    public ResponseEntity<Resource> downloadCv(@PathVariable Long cvId) throws MalformedURLException {
        Cv cv = cvService.getCvById(cvId);
        if (cv == null) {
            return ResponseEntity.notFound().build();
        }
        Path path = Paths.get(cv.getFilePath());
        if(!Files.exists(path)){
            return ResponseEntity.notFound().build();
        }
        Resource resource = new UrlResource(path.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + cv.getFileName() + "\"")
                .body(resource);
    }

}
