package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.media.MediaAttachmentRequest;
import ie.dylanmurray.website.service.MediaAttachmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MediaAttachmentController {

    private final MediaAttachmentService mediaAttachmentService;

    public MediaAttachmentController(
            MediaAttachmentService mediaAttachmentService
    ) {
        this.mediaAttachmentService = mediaAttachmentService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(
            "/projects/{projectId}/media/{mediaId}"
    )
    public ResponseEntity<Void> attachToProject(
            @PathVariable Long projectId,
            @PathVariable Long mediaId,
            @Valid @RequestBody MediaAttachmentRequest request
    ) {

        mediaAttachmentService.attachToProject(
                projectId,
                mediaId,
                request
        );

        return ResponseEntity.status(201).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(
            "/projects/{projectId}/media/{mediaId}"
    )
    public ResponseEntity<Void> updateProjectMedia(
            @PathVariable Long projectId,
            @PathVariable Long mediaId,
            @Valid @RequestBody MediaAttachmentRequest request
    ) {

        mediaAttachmentService.updateProjectAttachment(
                projectId,
                mediaId,
                request
        );

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(
            "/projects/{projectId}/media/{mediaId}"
    )
    public ResponseEntity<Void> removeFromProject(
            @PathVariable Long projectId,
            @PathVariable Long mediaId
    ) {

        mediaAttachmentService.removeFromProject(
                projectId,
                mediaId
        );

        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(
            "/work/{workId}/media/{mediaId}"
    )
    public ResponseEntity<Void> attachToWork(
            @PathVariable Long workId,
            @PathVariable Long mediaId,
            @Valid @RequestBody MediaAttachmentRequest request
    ) {

        mediaAttachmentService.attachToWork(
                workId,
                mediaId,
                request
        );

        return ResponseEntity.status(201).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(
            "/work/{workId}/media/{mediaId}"
    )
    public ResponseEntity<Void> updateWorkMedia(
            @PathVariable Long workId,
            @PathVariable Long mediaId,
            @Valid @RequestBody MediaAttachmentRequest request
    ) {

        mediaAttachmentService.updateWorkAttachment(
                workId,
                mediaId,
                request
        );

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(
            "/work/{workId}/media/{mediaId}"
    )
    public ResponseEntity<Void> removeFromWork(
            @PathVariable Long workId,
            @PathVariable Long mediaId
    ) {

        mediaAttachmentService.removeFromWork(
                workId,
                mediaId
        );

        return ResponseEntity.noContent().build();
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(
            "/pages/{slug}/media/{mediaId}"
    )
    public ResponseEntity<Void> attachToPage(
            @PathVariable String slug,
            @PathVariable Long mediaId,
            @Valid @RequestBody MediaAttachmentRequest request
    ) {

        mediaAttachmentService.attachToPage(
                slug,
                mediaId,
                request
        );

        return ResponseEntity.status(201).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(
            "/pages/{slug}/media/{mediaId}"
    )
    public ResponseEntity<Void> updatePageMedia(
            @PathVariable String slug,
            @PathVariable Long mediaId,
            @Valid @RequestBody MediaAttachmentRequest request
    ) {

        mediaAttachmentService.updatePageAttachment(
                slug,
                mediaId,
                request
        );

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(
            "/pages/{slug}/media/{mediaId}"
    )
    public ResponseEntity<Void> removeFromPage(
            @PathVariable String slug,
            @PathVariable Long mediaId
    ) {

        mediaAttachmentService.removeFromPage(
                slug,
                mediaId
        );

        return ResponseEntity.noContent().build();
    }
}