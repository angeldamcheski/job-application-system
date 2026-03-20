package com.example.jobapplicationservice.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkDTO {
    private Long jobPostId;
    private String jobTitle;
    private LocalDate savedOn;
}
