package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.controller.dto.JobPostCreateDTO;
import com.example.jobapplicationservice.controller.dto.JobPostEditDTO;
import com.example.jobapplicationservice.controller.dto.JobPostFilterDTO;
import com.example.jobapplicationservice.model.JobPost;
import com.example.jobapplicationservice.service.JobPostService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController()
@RequestMapping("/api/jobposts")
public class JobPostController {
    private final JobPostService jobPostService;

    public JobPostController(JobPostService jobPostService) {
        this.jobPostService = jobPostService;
    }

    @GetMapping()
    public List<JobPost> listAllJobs(JobPostFilterDTO jobPostFilterDTO) throws Exception {

        List<JobPost> jobPosts = jobPostService.listJobPosts(jobPostFilterDTO);
        if (jobPosts == null) {
            throw new Exception("Job posts are not available.");
        }
        return jobPosts;
    }

    @GetMapping("/{id}")
    public JobPost getJobPost(@PathVariable Long id){
        return jobPostService.getJobPost(id);
    }

    @PostMapping("/create")
    public JobPost createJob(@RequestBody @Valid JobPostCreateDTO jobPostCreateDto) {
        return jobPostService.createJobPost(jobPostCreateDto);
    }

    @PatchMapping("/{id}/edit")
    public JobPost editJob(@PathVariable Long id, @RequestBody @Valid JobPostEditDTO jobPostEditDto){
        return jobPostService.editJobPost(id, jobPostEditDto);
    }
    @DeleteMapping("/{id}/delete")
    public Map<String, String> deleteJobPost(@PathVariable Long id){
        jobPostService.deleteJobPost(id);
        return Map.of("message", "Job post deleted successfully");
    }

    @PatchMapping("/{id}/togglestatus")
    public String toggleJobStatus(@PathVariable Long id){
        return jobPostService.toggleJobStatus(id);
    }
}
