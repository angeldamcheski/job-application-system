package com.example.jobapplicationservice.service.implementation;

import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Bookmark;
import com.example.jobapplicationservice.model.JobPost;
import com.example.jobapplicationservice.repository.BookmarkRepository;
import com.example.jobapplicationservice.service.ApplicantService;
import com.example.jobapplicationservice.service.BookmarkService;
import com.example.jobapplicationservice.service.JobPostService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookmarkServiceImpl implements BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final ApplicantService applicantService;
    private final JobPostService jobPostService;

    public BookmarkServiceImpl(BookmarkRepository bookmarkRepository, ApplicantService applicantService, JobPostService jobPostService) {
        this.bookmarkRepository = bookmarkRepository;
        this.applicantService = applicantService;
        this.jobPostService = jobPostService;
    }

    @Override
    public List<Bookmark> listBookmarksByApplicant(Applicant applicant) {
        return bookmarkRepository.findByApplicant(applicant);
    }

    @Override
    public Bookmark saveBookmark(Long jobPostId, Long applicantId) {
        if(bookmarkRepository.existsByApplicant_IdAndJobPost_Id(applicantId, jobPostId)){
            throw new RuntimeException("Bookmark already exists");
        }
        Applicant applicant = applicantService.getById(applicantId);
        JobPost jobPost = jobPostService.getJobPost(jobPostId);
        Bookmark bookmark = new Bookmark();
        bookmark.setSavedOn(LocalDate.now());
        bookmark.setApplicant(applicant);
        bookmark.setJobPost(jobPost);
        bookmarkRepository.save(bookmark);
        return bookmark;
    }

    @Override
    @Transactional
    public void deleteBookmark(Long applicantId, Long jobPostId) {
        bookmarkRepository.deleteBookmarkByApplicantIdAndJobPost_Id(applicantId, jobPostId);
    }

}
