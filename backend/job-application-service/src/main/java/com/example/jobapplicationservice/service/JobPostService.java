package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.controller.dto.JobPost.JobPostCreateDTO;
import com.example.jobapplicationservice.controller.dto.JobPost.JobPostEditDTO;
import com.example.jobapplicationservice.controller.dto.JobPost.JobPostFilterDTO;
import com.example.jobapplicationservice.model.JobPost;

import java.util.List;

public interface JobPostService {
    JobPost getJobPost(Long id);

    JobPost createJobPost(JobPostCreateDTO jobPostCreateDto);

    JobPost editJobPost(Long id, JobPostEditDTO jobPostEditDto);

    JobPost deleteJobPost(Long id);

    String toggleJobStatus(Long id);

    List<JobPost> listJobPosts(JobPostFilterDTO jobPostFilterDTO, Long lastId, int size);

}
