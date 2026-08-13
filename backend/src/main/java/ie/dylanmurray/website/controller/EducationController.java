package ie.dylanmurray.website.controller;


import ie.dylanmurray.website.dto.education.*;
import ie.dylanmurray.website.dto.reorder.ReorderRequest;
import ie.dylanmurray.website.service.EducationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;


@RestController
@RequestMapping("/api/education")
public class EducationController {


    private final EducationService educationService;


    public EducationController(
            EducationService educationService
    ) {
        this.educationService = educationService;
    }



    @GetMapping
    public ResponseEntity<List<EducationResponse>> getEducation() {

        return ResponseEntity.ok(educationService.getAllEducation());

    }



    @GetMapping("/{id}")
    public ResponseEntity<EducationResponse> getEducationById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(educationService.getEducationById(id));

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<EducationResponse> createEducation(
            @Valid @RequestBody EducationRequest request
    ) {
        EducationResponse response = educationService.createEducation(request);
        return ResponseEntity.status(201).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EducationResponse> updateEducation(
            @PathVariable Long id,
            @Valid @RequestBody EducationRequest request
    ) {
        return ResponseEntity.ok(educationService.updateEducation(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderEducation(@Valid @RequestBody ReorderRequest request) {
        educationService.reorderEducation(request.getIds());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(
            @PathVariable Long id
    ) {

        educationService.deleteEducation(id);

        return ResponseEntity.noContent().build();

    }

}