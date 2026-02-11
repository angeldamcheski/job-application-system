package com.example.jobapplicationservice.model;

import com.example.jobapplicationservice.model.base.User;
import com.example.jobapplicationservice.model.enums.UserRole;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
public class Applicant extends User {
    private UserRole role = UserRole.APPLICANT;


    //TODO: Add List<Application> applications
}
