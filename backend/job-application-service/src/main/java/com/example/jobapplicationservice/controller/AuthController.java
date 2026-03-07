package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.controller.dto.Auth.AuthResponseDTO;
import com.example.jobapplicationservice.controller.dto.Auth.LoginDTO;
import com.example.jobapplicationservice.controller.dto.Auth.RegisterDTO;
import com.example.jobapplicationservice.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO){
        AuthResponseDTO response = authService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegisterDTO registerDTO){
        AuthResponseDTO response = authService.register(registerDTO);
        return ResponseEntity.ok(response);
    }
}
