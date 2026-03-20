package com.example.jobapplicationservice.service;

import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Bookmark;
import com.example.jobapplicationservice.model.JobPost;

import java.util.List;

public interface BookmarkService {
    List<Bookmark> listBookmarksByApplicant(Applicant applicant);
    Bookmark saveBookmark(Long jobPostId, Long applicantId);
    void deleteBookmark(Long applicantId, Long jobPostId);
}
