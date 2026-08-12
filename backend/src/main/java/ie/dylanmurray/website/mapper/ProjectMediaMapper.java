package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.projectmedia.ProjectMediaResponse;
import ie.dylanmurray.website.entity.ProjectMedia;
import org.springframework.stereotype.Component;

@Component
public class ProjectMediaMapper {

    private final MediaMapper mediaMapper;

    public ProjectMediaMapper(
            MediaMapper mediaMapper
    ) {
        this.mediaMapper = mediaMapper;
    }

    public ProjectMediaResponse toResponse(
            ProjectMedia projectMedia
    ) {

        return new ProjectMediaResponse(
                projectMedia.getId(),
                projectMedia.getDisplayOrder(),
                projectMedia.getCaption(),
                projectMedia.getAltText(),
                mediaMapper.toResponse(
                        projectMedia.getMedia()
                )
        );
    }
}