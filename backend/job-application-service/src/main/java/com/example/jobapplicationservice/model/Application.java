package com.example.jobapplicationservice.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long id;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String emailAddress;
    private String preferredLanguage;

}
