package com.example.jobapplicationservice.repository.specifications;

import com.example.jobapplicationservice.model.JobPost;
import com.example.jobapplicationservice.model.enums.JobStatus;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class JobPostSpecifications {
    public static Specification<JobPost> hasStatus(JobStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("jobStatus"), status);
    }

    public static Specification<JobPost> hasAnyTag(List<String> tags) {
        return (root, query, cb) -> {
            if(tags == null || tags.isEmpty()){
                return cb.conjunction();
            }
            Join<JobPost, String> tagJoin = root.join("jobTags");
//            List<String> lowerCaseTags = tags.stream().map(String::toLowerCase).toList();
            var predicates = tags.stream().map(tag-> cb.like(cb.lower(tagJoin), "%" + tag.toLowerCase() + "%")).toArray(jakarta.persistence.criteria.Predicate[]::new);

//            return cb.lower(cb.trim(tagJoin)).in(lowerCaseTags);

            query.distinct(true);
            return cb.or(predicates);
        };
    }
}
