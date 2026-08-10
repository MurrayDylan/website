package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.technology.TechnologyRequest;
import ie.dylanmurray.website.dto.technology.TechnologyResponse;
import ie.dylanmurray.website.service.TechnologyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/technologies")
public class TechnologyController {

    private final TechnologyService technologyService;

    public TechnologyController(
            TechnologyService technologyService
    ) {
        this.technologyService = technologyService;
    }

    @GetMapping
    public ResponseEntity<List<TechnologyResponse>>
    getTechnologies() {

        return ResponseEntity.ok(
                technologyService.getAllTechnologies()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TechnologyResponse>
    getTechnology(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                technologyService.getTechnologyById(id)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TechnologyResponse>
    createTechnology(
            @Valid @RequestBody TechnologyRequest request
    ) {

        TechnologyResponse response =
                technologyService.createTechnology(request);

        return ResponseEntity
                .status(201)
                .body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TechnologyResponse>
    updateTechnology(
            @PathVariable Long id,
            @Valid @RequestBody TechnologyRequest request
    ) {

        return ResponseEntity.ok(
                technologyService.updateTechnology(
                        id,
                        request
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnology(
            @PathVariable Long id
    ) {

        technologyService.deleteTechnology(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}