package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.model.Admin;
import com.example.jobapplicationservice.model.base.User;
import com.example.jobapplicationservice.model.enums.UserRole;
import com.example.jobapplicationservice.service.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long expirationTime;

    @Override
    public String generateToken(User user) {
        String role = user instanceof Admin ? "ADMIN" : "APPLICANT";
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.builder()
                .setSubject(user.getEmailAddress())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
