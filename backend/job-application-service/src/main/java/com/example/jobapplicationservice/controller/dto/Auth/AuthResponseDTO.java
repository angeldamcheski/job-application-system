package com.example.jobapplicationservice.controller.dto.Auth;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String emailAddress;
    private String role; // "ADMIN" or "APPLICANT"
    private String token; // JWT token
    @Nullable
    private String profileImageUrl;
}