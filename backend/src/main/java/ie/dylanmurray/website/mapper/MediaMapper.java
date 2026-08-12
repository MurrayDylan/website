package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.media.MediaResponse;
import ie.dylanmurray.website.entity.Media;
import org.springframework.stereotype.Component;

@Component
public class MediaMapper {

    public MediaResponse toResponse(Media media) {

        return new MediaResponse(
                media.getId(),
                media.getOriginalFilename(),
                media.getContentType(),
                media.getFileSize(),
                media.getSha256Hash(),
                media.getCreatedAt(),
                "/api/media/" + media.getId() + "/view",
                "/api/media/" + media.getId() + "/download"
        );
    }
}