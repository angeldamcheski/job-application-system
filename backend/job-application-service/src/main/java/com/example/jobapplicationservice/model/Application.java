package com.example.jobapplicationservice.model;

import com.example.jobapplicationservice.model.enums.ApplicationStatus;
import com.example.jobapplicationservice.model.enums.JobStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"job_post_id", "applicant_id"})
})
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_post_id")
    @JsonBackReference
    private JobPost jobPost;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "applicant_id")
    @JsonIgnore
    private Applicant applicant;

    @Column(name = "application_status")
    private ApplicationStatus applicationStatus;

    private LocalDate submittedDate;
}
