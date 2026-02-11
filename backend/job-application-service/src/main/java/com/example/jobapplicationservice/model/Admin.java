package com.example.jobapplicationservice.model;

import com.example.jobapplicationservice.model.base.User;
import com.example.jobapplicationservice.model.enums.UserRole;
import jakarta.persistence.Entity;

@Entity
public class Admin extends User {
    private UserRole role = UserRole.ADMIN;
}
