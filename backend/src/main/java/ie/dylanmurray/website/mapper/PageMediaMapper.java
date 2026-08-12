package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.pagemedia.PageMediaResponse;
import ie.dylanmurray.website.entity.PageMedia;
import org.springframework.stereotype.Component;

@Component
public class PageMediaMapper {

    private final MediaMapper mediaMapper;

    public PageMediaMapper(
            MediaMapper mediaMapper
    ) {
        this.mediaMapper = mediaMapper;
    }

    public PageMediaResponse toResponse(
            PageMedia pageMedia
    ) {

        return new PageMediaResponse(
                pageMedia.getId(),
                pageMedia.getDisplayOrder(),
                pageMedia.getCaption(),
                pageMedia.getAltText(),
                mediaMapper.toResponse(
                        pageMedia.getMedia()
                )
        );
    }
}