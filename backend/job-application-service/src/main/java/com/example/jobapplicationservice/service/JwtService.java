package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.model.base.User;

public interface JwtService {
    String generateToken(User user);

}
