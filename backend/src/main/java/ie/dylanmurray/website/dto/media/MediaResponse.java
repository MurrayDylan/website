package ie.dylanmurray.website.dto.media;

import java.time.LocalDateTime;

public record MediaResponse(

        Long id,

        String originalFilename,

        String contentType,

        Long fileSize,

        String sha256Hash,

        LocalDateTime createdAt,

        String viewUrl,

        String downloadUrl

) {
}