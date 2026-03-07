package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.controller.dto.Auth.AuthResponseDTO;
import com.example.jobapplicationservice.controller.dto.Auth.LoginDTO;
import com.example.jobapplicationservice.controller.dto.Auth.RegisterDTO;
import com.example.jobapplicationservice.model.base.User;

public interface AuthService {
    AuthResponseDTO login(LoginDTO loginDTO);
    AuthResponseDTO register(RegisterDTO registerDTO);
    AuthResponseDTO mapToAuthResponse(User user, String token);
}
