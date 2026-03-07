package com.example.jobapplicationservice.service.implementation;


import com.example.jobapplicationservice.controller.dto.JobPost.JobPostCreateDTO;
import com.example.jobapplicationservice.controller.dto.JobPost.JobPostEditDTO;
import com.example.jobapplicationservice.controller.dto.JobPost.JobPostFilterDTO;
import com.example.jobapplicationservice.model.JobPost;
import com.example.jobapplicationservice.model.enums.JobStatus;
import com.example.jobapplicationservice.repository.JobPostRepository;
import com.example.jobapplicationservice.service.JobPostService;
import jakarta.persistence.criteria.Join;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import jakarta.persistence.criteria.Predicate;

@Service
public class JobPostServiceImpl implements JobPostService {

    private final JobPostRepository jobPostRepository;

    public JobPostServiceImpl(JobPostRepository jobPostRepository) {
        this.jobPostRepository = jobPostRepository;
    }

    @Override
    public List<JobPost> listJobPosts(JobPostFilterDTO jobPostFilterDTO, Long lastId, int size) {
        Specification<JobPost> spec = (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            if (lastId != null) {
                predicates.add(cb.lessThan(root.get("id"), lastId));
            }

            if (jobPostFilterDTO != null) {

                if (jobPostFilterDTO.getJobStatus() != null) {
                    predicates.add(cb.equal(root.get("jobStatus"), jobPostFilterDTO.getJobStatus()));
                }

                if (jobPostFilterDTO.getJobTags() != null && !jobPostFilterDTO.getJobTags().isEmpty()) {
                    Join<JobPost, String> tagsJoin = root.join("jobTags");
//                    predicates.add(tagsJoin.in(jobPostFilterDTO.getJobTags()));
                    List<Predicate> tagPredicates = jobPostFilterDTO.getJobTags()
                            .stream()
                            .map(tag ->
                                    cb.like(
                                            cb.lower(tagsJoin),
                                            "%" + tag.toLowerCase() + "%"
                                    )
                            )
                            .toList();

                    // Match ANY of the provided tags
                    predicates.add(cb.or(tagPredicates.toArray(new Predicate[0])));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };


        Pageable pageable = PageRequest.of(0, size, Sort.by("id").descending());

        return jobPostRepository.findAll(spec, pageable).getContent();
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

            jobPost.setUpdateDate(LocalDate.now());


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
