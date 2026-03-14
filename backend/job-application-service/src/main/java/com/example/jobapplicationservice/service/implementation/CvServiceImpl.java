package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Cv;
import com.example.jobapplicationservice.repository.CvRepository;
import com.example.jobapplicationservice.service.ApplicantService;
import com.example.jobapplicationservice.service.CvService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class CvServiceImpl implements CvService {
    private final CvRepository cvRepository;
    private final ApplicantService applicantService;
    @Value("${cv.storage.path}")
    private String storagePath;

    public CvServiceImpl(CvRepository cvRepository, ApplicantService applicantService) {
        this.cvRepository = cvRepository;
        this.applicantService = applicantService;
    }

    @Override
    public Cv uploadCv(Long applicantId, MultipartFile file) throws IOException{
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File exceeds 10MB limit");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }
        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }


        Applicant applicant = applicantService.getById(applicantId);
        if (applicant == null) {
            throw new IllegalArgumentException("Applicant not found");
        }


        Cv cv = cvRepository.findByApplicant(applicant).orElse(null);
        boolean isNewCv = false;

        if (cv == null) {
            cv = new Cv();
            cv.setApplicant(applicant);
            isNewCv = true;
        }


        Path path;
        if (isNewCv || cv.getFilePath() == null) {

            Files.createDirectories(Paths.get(storagePath));
            String fileName = UUID.randomUUID() + ".pdf";
            path = Paths.get(storagePath, fileName);
            cv.setFilePath(path.toString());
        } else {

            path = Paths.get(cv.getFilePath());
        }


        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);


        cv.setFileName(file.getOriginalFilename());
        cv.setSize(file.getSize());


        return cvRepository.save(cv);
    }
//    @Override
//    public Cv uploadCv(Long applicantId, MultipartFile file) throws IOException {
//        if (file.isEmpty()) {
//            throw new RuntimeException("File is empty");
//        }
//        if (file.getSize() > 10 * 1024 * 1024) {
//            throw new RuntimeException("File exceeds 10MB limit");
//        }
//        if (!file.getContentType().equals("application/pdf")) {
//            throw new RuntimeException("Only PDF files are allowed");
//        }
//        if (!file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
//            throw new RuntimeException("Only PDF files allowed");
//        }
////        Applicant applicant = applicantService.getById(applicantId);
////
////        Files.createDirectories(Paths.get(storagePath));
////
////        String fileName = UUID.randomUUID() + ".pdf";
////
////        Path path = Paths.get(storagePath, fileName);
////        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
////        Cv cv = cvRepository.findByApplicant(applicant).orElse(new Cv());
////        cv.setApplicant(applicant);
////        cv.setFileName(file.getOriginalFilename());
////        cv.setFilePath(path.toString());
////        cv.setSize(file.getSize());
////        return cvRepository.save(cv);
//        Applicant applicant = applicantService.getById(applicantId);
//        Cv cv = cvRepository.findByApplicant(applicant).orElse(new Cv());
//        cv.setApplicant(applicant);
//        cv.setFileName(file.getOriginalFilename());
//        cv.setSize(file.getSize());
//
//        if (cv.getId() == null || cv.getFilePath() == null) {
//            Files.createDirectories(Paths.get(storagePath));
//            String fileName = UUID.randomUUID() + ".pdf";
//            Path path = Paths.get(storagePath, fileName);
//            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
//
//        } else {
//            Path path = Paths.get(cv.getFilePath());
//            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
//        }
//        return cvRepository.save(cv);
//    }

    @Override
    public Cv getUserCv(Long applicantId) {
        return cvRepository.findByApplicantId(applicantId);
    }

    @Override
    public Cv getCvById(Long cvId) {
        return cvRepository.findById(cvId).orElse(null);
    }
}
