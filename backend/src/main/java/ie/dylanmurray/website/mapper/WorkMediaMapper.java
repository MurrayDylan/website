package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.workmedia.WorkMediaResponse;
import ie.dylanmurray.website.entity.WorkMedia;
import org.springframework.stereotype.Component;

@Component
public class WorkMediaMapper {

    private final MediaMapper mediaMapper;

    public WorkMediaMapper(
            MediaMapper mediaMapper
    ) {
        this.mediaMapper = mediaMapper;
    }

    public WorkMediaResponse toResponse(
            WorkMedia workMedia
    ) {

        return new WorkMediaResponse(
                workMedia.getId(),
                workMedia.getDisplayOrder(),
                workMedia.getCaption(),
                workMedia.getAltText(),
                workMedia.getIsHorizontal(),
                mediaMapper.toResponse(
                        workMedia.getMedia()
                )
        );
    }
}