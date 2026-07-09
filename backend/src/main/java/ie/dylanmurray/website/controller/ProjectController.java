package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.project.ProjectRequest;
import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    public ProjectController(
            ProjectService projectService
    ) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects() {
        return ResponseEntity.ok(
                projectService.getAllProjects()
        );

    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                projectService.getProjectById(id)
        );

    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request
    ) {
        ProjectResponse response = projectService.createProject(request);

        return ResponseEntity
                .status(201)
                .body(response);

    }
}