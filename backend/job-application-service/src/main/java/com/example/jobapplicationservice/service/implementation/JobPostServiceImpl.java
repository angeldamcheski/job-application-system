package com.example.jobapplicationservice.service.implementation;


import com.example.jobapplicationservice.controller.dto.JobPostCreateDTO;
import com.example.jobapplicationservice.controller.dto.JobPostEditDTO;
import com.example.jobapplicationservice.controller.dto.JobPostFilterDTO;
import com.example.jobapplicationservice.model.JobPost;
import com.example.jobapplicationservice.model.enums.JobStatus;
import com.example.jobapplicationservice.repository.JobPostRepository;
import com.example.jobapplicationservice.repository.specifications.JobPostSpecifications;
import com.example.jobapplicationservice.service.JobPostService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class JobPostServiceImpl implements JobPostService {

    private final JobPostRepository jobPostRepository;

    public JobPostServiceImpl(JobPostRepository jobPostRepository) {
        this.jobPostRepository = jobPostRepository;
    }

    @Override
    public List<JobPost> listJobPosts(JobPostFilterDTO jobPostFilterDTO) {
        Specification<JobPost> spec = (root, query, cb) -> cb.conjunction();
        if (jobPostFilterDTO != null) {
            spec = spec.and(JobPostSpecifications.hasStatus(jobPostFilterDTO.getJobStatus())).and(JobPostSpecifications.hasAnyTag(jobPostFilterDTO.getJobTags()));
        }
        return jobPostRepository.findAll(spec);
    }


    @Override
    public JobPost getJobPost(Long id) {
        return jobPostRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Job post with id: " + id + " doesn't exist"));
    }

    @Override
    public JobPost createJobPost(JobPostCreateDTO jobPostCreateDto) {
        List<String> processedTags = jobPostCreateDto==null? List.of() : jobPostCreateDto.getJobTags().stream().map(String::trim).toList();
        JobPost jobPost = new JobPost(
                jobPostCreateDto.getTitle(),
                jobPostCreateDto.getShortDescription(),
                jobPostCreateDto.getFullDescription(),
                processedTags,
                jobPostCreateDto.getJobStatus(),
                LocalDate.now(),
                LocalDate.now()
        );
        jobPostRepository.save(jobPost);
        return jobPost;
    }

    @Override
    public JobPost editJobPost(Long id, JobPostEditDTO jobPostEditDto) {
        JobPost jobPost = jobPostRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Job post with id: " + id + " is not found."));

        if (jobPostEditDto.getTitle() != null) {
            jobPost.setTitle(jobPostEditDto.getTitle());
        }
        if (jobPostEditDto.getShortDescription() != null) {
            jobPost.setShortDescription(jobPostEditDto.getShortDescription());
        }
        if (jobPostEditDto.getFullDescription() != null) {
            jobPost.setFullDescription(jobPostEditDto.getFullDescription());
        }
        if (jobPostEditDto.getJobTags() != null) {
            jobPost.setJobTags(jobPostEditDto.getJobTags());
        }
        if (jobPostEditDto.getJobStatus() != null) {
            jobPost.setJobStatus(jobPostEditDto.getJobStatus());
        }
        if (jobPostEditDto.getCreatedDate() != null) {
            jobPost.setCreationDate(jobPostEditDto.getCreatedDate());
        }
        if (jobPostEditDto.getUpdatedDate() != null) {
            jobPost.setUpdateDate(LocalDate.now());
        }

        jobPostRepository.save(jobPost);


        return jobPost;
    }

    @Override
    public JobPost deleteJobPost(Long id) {
        JobPost jobPost = jobPostRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Job post with id: " + id + " is not found."));
        jobPostRepository.delete(jobPost);

        return jobPost;
    }


    public String toggleJobStatus(Long id) {
        JobPost jobPost = jobPostRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Job post with id: " + id + " is not found."));
        if (jobPost.getJobStatus().equals(JobStatus.ACTIVE)) {
            jobPost.setJobStatus(JobStatus.INACTIVE);
            jobPostRepository.save(jobPost);
            return "Job post with title " + jobPost.getTitle() + " is now inactive.";
        }
        jobPost.setJobStatus(JobStatus.ACTIVE);
        jobPostRepository.save(jobPost);
        return "Job post with title " + jobPost.getTitle() + " is now active.";
    }


}
