package com.example.jobapplicationservice.controller;

import com.example.jobapplicationservice.controller.dto.BookmarkDTO;
import com.example.jobapplicationservice.model.Applicant;
import com.example.jobapplicationservice.model.Bookmark;
import com.example.jobapplicationservice.service.ApplicantService;
import com.example.jobapplicationservice.service.BookmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {
    private final BookmarkService bookmarkService;
    private final ApplicantService applicantService;
    public BookmarkController(BookmarkService bookmarkService, ApplicantService applicantService) {
        this.bookmarkService = bookmarkService;
        this.applicantService = applicantService;
    }

    @GetMapping("/{applicantId}/get")
    public ResponseEntity<List<Long>> getBookmarksByApplicant(@PathVariable Long applicantId){
        Applicant applicant = applicantService.getById(applicantId);
        List<Long> jobIds = bookmarkService.listBookmarksByApplicant(applicant)
                .stream()
                .map(b->b.getJobPost().getId())
                .toList();
        return ResponseEntity.ok(jobIds);
    }
    @GetMapping("/{applicantId}/saved")
    public ResponseEntity<List<BookmarkDTO>> getBookmarksDTOByApplicant(@PathVariable Long applicantId){
        Applicant applicant = applicantService.getById(applicantId);
        List<BookmarkDTO> bookmarks = bookmarkService.listBookmarksByApplicant(applicant)
                .stream()
                .map(b-> new BookmarkDTO(b.getJobPost().getId(), b.getJobPost().getTitle(), b.getSavedOn()))
                .toList();
        return ResponseEntity.ok(bookmarks);
    }
    @PostMapping("/save")
    public ResponseEntity<?> saveJobPost(@RequestParam Long applicantId, @RequestParam Long jobPostId){
        Bookmark bookmark = bookmarkService.saveBookmark(jobPostId, applicantId);
        return ResponseEntity.ok(bookmark);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> unsaveJobPost(@RequestParam Long applicantId, @RequestParam Long jobPostId){
        bookmarkService.deleteBookmark(applicantId, jobPostId);
        return ResponseEntity.ok("Bookmark deleted successfully");
    }
}
