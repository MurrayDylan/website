package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.media.MediaResponse;
import ie.dylanmurray.website.service.MediaService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(
            MediaService mediaService
    ) {
        this.mediaService = mediaService;
    }

    @GetMapping("/cv")
    public ResponseEntity<Resource> downloadCv() throws IOException {
        MediaService.MediaFile cvFile = mediaService.getCvFile();
        Resource resource = new FileSystemResource(cvFile.path());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(cvFile.contentType()))
                .contentLength(resource.contentLength())
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, must-revalidate")
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline() // <-- CHANGE THIS TO INLINE
                                .filename(cvFile.originalFilename())
                                .build()
                                .toString()
                )
                .body(resource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/cv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadCv(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        mediaService.uploadCv(file);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/hash/{sha256Hash}")
    public ResponseEntity<MediaResponse> checkHash(
            @PathVariable String sha256Hash
    ) {

        MediaResponse response =
                mediaService.checkHash(sha256Hash);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MediaResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sha256Hash") String sha256Hash
    ) throws IOException {

        MediaResponse response =
                mediaService.upload(
                        file,
                        sha256Hash
                );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> view(@PathVariable Long id) {
        try {
            MediaService.MediaFile mediaFile = mediaService.getFile(id);
            Resource resource = new FileSystemResource(mediaFile.path());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mediaFile.contentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + mediaFile.originalFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @PathVariable Long id
    ) throws IOException {

        MediaService.MediaFile mediaFile =
                mediaService.getFile(id);

        Path path = mediaFile.path();

        Resource resource =
                new FileSystemResource(path);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(
                        MediaType.APPLICATION_OCTET_STREAM
                )
                .contentLength(
                        resource.contentLength()
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition
                                .attachment()
                                .filename(
                                        mediaFile.originalFilename()
                                )
                                .build()
                                .toString()
                )
                .body(resource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) throws IOException {

        mediaService.deleteMedia(id);

        return ResponseEntity.noContent().build();
    }
}