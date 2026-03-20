package com.example.jobapplicationservice.model;

import com.example.jobapplicationservice.model.base.User;
import com.example.jobapplicationservice.model.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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

    @OneToOne(mappedBy = "applicant", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cv cv;

    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Bookmark> bookmarks = new ArrayList<>();
}
