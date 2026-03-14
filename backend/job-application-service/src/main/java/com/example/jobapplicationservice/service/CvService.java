package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.model.Cv;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CvService {
    Cv uploadCv(Long applicantId, MultipartFile cv) throws IOException;
    Cv getUserCv(Long applicantId);
    Cv getCvById(Long cvId);
}
