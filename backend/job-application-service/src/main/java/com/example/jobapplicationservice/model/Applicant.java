package com.example.jobapplicationservice.model;

import com.example.jobapplicationservice.model.base.User;
import com.example.jobapplicationservice.model.enums.UserRole;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "applicant")
public class Applicant extends User {
    private UserRole role = UserRole.APPLICANT;


    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Application> applications = new ArrayList<>();
}
