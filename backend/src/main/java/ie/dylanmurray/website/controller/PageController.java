package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.page.PageRequest;
import ie.dylanmurray.website.dto.page.PageResponse;
import ie.dylanmurray.website.service.PageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
public class PageController {

    private final PageService pageService;

    public PageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PageResponse> getPageBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(pageService.getPageBySlug(slug));
    }

    @GetMapping
    public ResponseEntity<List<PageResponse>> getAllPages() {
        return ResponseEntity.ok(pageService.getAllPages());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PageResponse> createPage(@Valid @RequestBody PageRequest request) {
        return ResponseEntity.status(201).body(pageService.createPage(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{slug}")
    public ResponseEntity<PageResponse> updatePage(
            @PathVariable String slug,
            @Valid @RequestBody PageRequest request
    ) {
        return ResponseEntity.ok(pageService.updatePage(slug, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> deletePage(@PathVariable String slug) {
        pageService.deletePage(slug);
        return ResponseEntity.noContent().build();
    }
}