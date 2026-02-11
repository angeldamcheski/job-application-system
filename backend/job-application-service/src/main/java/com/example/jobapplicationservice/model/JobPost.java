package com.example.jobapplicationservice.model;

import com.example.jobapplicationservice.model.enums.JobStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Data
@Entity
@NoArgsConstructor
@Table(name = "job_posts")
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_post_id")
    private Long id;

    @Column(name = "post_title")
    @NotNull(message = "Title must not be null")
    @NotBlank(message = "Title must not be empty...")
    private String title;

    @Column(name = "post_short_description")
    private String shortDescription;

    @Column(name = "post_full_description")
    private String fullDescription;


    @ElementCollection
    @CollectionTable(
            name = "job_post_tags",
            joinColumns = @JoinColumn(name = "job_post_id")
    )
    @Column(name = "tag")
    private List<String> jobTags = new ArrayList<>();

    @Column(name = "job_status")
    private JobStatus jobStatus;

    @Column(name = "job_created_date")
    private LocalDate creationDate;

    @Column(name = "job_updated_date")
    private LocalDate updateDate;

    public JobPost(String title, String shortDescription, String fullDescription, List<String> jobTags, JobStatus jobStatus, LocalDate creationDate, LocalDate updateDate) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.jobTags = jobTags;
        this.jobStatus = jobStatus;
        this.creationDate = creationDate;
        this.updateDate = updateDate;


    }
//    @ManyToOne
//    private Admin admin;
    //TODO: Add List<Application> applications


//    @ManyToOne
//    private User user;

}
