package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.controller.dto.Applicant.ApplicantEditDTO;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.repository.ApplicantRepository;
import com.example.jobapplicationservice.service.ApplicantService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.UUID;

@Service
public class ApplicantServiceImpl implements ApplicantService {
    private final ApplicantRepository applicantRepository;
    @Value("${profile.image.storage.path}")
    private String imageStoragePath;
    public ApplicantServiceImpl(ApplicantRepository applicantRepository) {
        this.applicantRepository = applicantRepository;

    }

    @Override
    public Applicant getById(Long id) {
        return applicantRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Applicant with id: " + id + " is not found."));
    }

    @Override
    public List<Applicant> listAllApplicants() {
        return applicantRepository.findAll();
    }

    @Override
    public Applicant createApplicant(Applicant applicant) {
        return applicantRepository.save(applicant);
    }

    @Override
    public Applicant updateApplicant(Long id, ApplicantEditDTO applicantEditDto) {
        Applicant applicant = getById(id);

        if (applicantEditDto.getFirstName() != null) {
            applicant.setFirstName(applicantEditDto.getFirstName());
        }
        if (applicantEditDto.getLastName() != null) {
            applicant.setLastName(applicantEditDto.getLastName());
        }
        if (applicantEditDto.getEmailAddress() != null) {
            applicant.setEmailAddress(applicantEditDto.getEmailAddress());
        }
        if (applicantEditDto.getPhoneNumber() != null) {
            applicant.setPhoneNumber(applicantEditDto.getPhoneNumber());
        }
        return applicantRepository.save(applicant);
    }

    @Override
    public void deleteApplicant(Long id) {
        Applicant applicant = getById(id);
        applicantRepository.delete(applicant);
    }

    @Override
    public Page<Applicant> getPaginatedApplicants(Pageable pageable, String email) {
        if (email != null && !email.isBlank()) {
            return applicantRepository
                    .findByEmailAddressContainingIgnoreCase(email, pageable);
        }
        // This will handle the SQL LIMIT and OFFSET automatically
        return applicantRepository.findAll(pageable);
    }

    @Override
    public String uploadProfilePhoto(Long id, MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (!Objects.requireNonNull(file.getContentType()).startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            throw new IllegalArgumentException("Max image size is 2MB");
        }
        Applicant applicant = getById(id);
        Files.createDirectories(Paths.get(imageStoragePath));
        String extension = Objects.requireNonNull(file.getOriginalFilename())
                .substring(file.getOriginalFilename().lastIndexOf("."));

        String fileName = UUID.randomUUID() + extension;

        Path path = Paths.get(imageStoragePath, fileName);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        if (applicant.getProfileImageUrl() != null) {
            String oldFileName = applicant.getProfileImageUrl()
                    .replace("/uploads/profile-images/", "");

            Path oldPath = Paths.get(imageStoragePath, oldFileName);
            Files.deleteIfExists(oldPath);
        }
        String imageUrl = "/uploads/profile-images/" + fileName;
        applicant.setProfileImageUrl(imageUrl);
        applicantRepository.save(applicant);
        return imageUrl;
    }


}
