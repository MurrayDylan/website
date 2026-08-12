package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.entity.LayoutTemplate;
import ie.dylanmurray.website.repository.LayoutTemplateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/layout-templates")
public class LayoutTemplateController {

    private final LayoutTemplateRepository repository;

    public LayoutTemplateController(LayoutTemplateRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<LayoutTemplate>> getAllTemplates() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{layoutType}")
    public ResponseEntity<LayoutTemplate> getTemplate(@PathVariable String layoutType) {
        return repository.findById(layoutType)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(new LayoutTemplate(layoutType, Map.of(), "")));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<LayoutTemplate> createTemplate(@RequestBody Map<String, Object> body) {
        String layoutType = (String) body.get("layoutType");
        if (layoutType == null || layoutType.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String formattedName = layoutType.trim().toUpperCase().replace(" ", "_");

        Map<String, Object> metadata = body.containsKey("defaultMetadata") && body.get("defaultMetadata") != null
                ? (Map<String, Object>) body.get("defaultMetadata")
                : Map.of();

        String content = body.containsKey("defaultContent") && body.get("defaultContent") != null
                ? (String) body.get("defaultContent")
                : "";

        LayoutTemplate template = new LayoutTemplate(formattedName, metadata, content);
        return ResponseEntity.ok(repository.save(template));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{layoutType}")
    public ResponseEntity<LayoutTemplate> updateTemplate(
            @PathVariable String layoutType,
            @RequestBody Map<String, Object> body
    ) {
        LayoutTemplate template = repository.findById(layoutType)
                .orElse(new LayoutTemplate(layoutType, Map.of(), ""));

        if (body.containsKey("defaultMetadata")) {
            template.setDefaultMetadata((Map<String, Object>) body.get("defaultMetadata"));
        }
        if (body.containsKey("defaultContent")) {
            template.setDefaultContent((String) body.get("defaultContent"));
        }

        return ResponseEntity.ok(repository.save(template));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{layoutType}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String layoutType) {
        if (repository.existsById(layoutType)) {
            repository.deleteById(layoutType);
        }
        return ResponseEntity.noContent().build();
    }
}