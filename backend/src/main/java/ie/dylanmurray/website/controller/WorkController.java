package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.reorder.ReorderRequest;
import ie.dylanmurray.website.dto.work.WorkRequest;
import ie.dylanmurray.website.dto.work.WorkResponse;
import ie.dylanmurray.website.service.WorkService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/work")
public class WorkController {


    private final WorkService workService;


    public WorkController(
            WorkService workService
    ) {
        this.workService = workService;
    }


    @GetMapping
    public ResponseEntity<List<WorkResponse>> getWork() {

        return ResponseEntity.ok(
                workService.getAllWork()
        );

    }


    @GetMapping("/{id}")
    public ResponseEntity<WorkResponse> getWork(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                workService.getWorkById(id)
        );

    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<WorkResponse> createWork(
            @Valid @RequestBody WorkRequest request
    ) {

        WorkResponse response = workService.createWork(request);

        return ResponseEntity
                .status(201)
                .body(response);

    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<WorkResponse> updateWork(
            @PathVariable Long id,
            @Valid @RequestBody WorkRequest request
    ) {

        return ResponseEntity.ok(
                workService.updateWork(id, request)
        );

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderWorkExperience(@Valid @RequestBody ReorderRequest request) {
        workService.reorderWorkExperiences(request.getIds());
        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWork(
            @PathVariable Long id
    ) {

        workService.deleteWork(id);

        return ResponseEntity.noContent().build();

    }

}