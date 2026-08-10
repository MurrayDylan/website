package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.projectlink.ProjectLinkRequest;
import ie.dylanmurray.website.dto.projectlink.ProjectLinkResponse;
import ie.dylanmurray.website.entity.ProjectLink;
import org.springframework.stereotype.Component;

@Component
public class ProjectLinkMapper {

    public ProjectLinkResponse toResponse(ProjectLink link) {
        return new ProjectLinkResponse(
                link.getId(),
                link.getLabel(),
                link.getUrl()
        );
    }

    public ProjectLink toEntity(ProjectLinkRequest request) {


        ProjectLink projectLink = new ProjectLink();

        projectLink.setLabel(request.getLabel());

        projectLink.setUrl(request.getUrl());

        return projectLink;
    }


}
