package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.controller.dto.Auth.AuthResponseDTO;
import com.example.jobapplicationservice.controller.dto.Auth.LoginDTO;
import com.example.jobapplicationservice.controller.dto.Auth.RegisterDTO;
import com.example.jobapplicationservice.model.Admin;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.base.User;
import com.example.jobapplicationservice.model.enums.UserRole;
import com.example.jobapplicationservice.repository.UserRepository;
import com.example.jobapplicationservice.service.AuthService;
import com.example.jobapplicationservice.service.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private final JwtService jwtService;

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByEmailAddress(loginDTO.getEmailAddress());
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtService.generateToken(user);
        return mapToAuthResponse(user, token);
    }

    @Override
    public AuthResponseDTO register(RegisterDTO registerDTO) {
        if (userRepository.existsByEmailAddress(registerDTO.getEmailAddress())) {
            throw new IllegalArgumentException("Email already in use.");
        }
        Applicant applicant = new Applicant();
        applicant.setFirstName(registerDTO.getFirstName());
        applicant.setLastName(registerDTO.getLastName());
        applicant.setEmailAddress(registerDTO.getEmailAddress());
        applicant.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        applicant.setRole(UserRole.APPLICANT);

        userRepository.save(applicant);
        String token = jwtService.generateToken(applicant);
        return mapToAuthResponse(applicant, token);
    }

    @Override
    public AuthResponseDTO mapToAuthResponse(User user, String token) {
        return new AuthResponseDTO(user.getId(), user.getFirstName(),
                user.getLastName(),
                user.getEmailAddress(),
                user instanceof Admin ? UserRole.ADMIN.name() : UserRole.APPLICANT.name(), token, user.getProfileImageUrl());
    }
}
