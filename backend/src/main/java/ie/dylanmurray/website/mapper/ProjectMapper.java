package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.entity.Project;
import org.springframework.stereotype.Component;

@Component
public class ProjectMapper {

    private final TechnologyMapper technologyMapper;
    private final ProjectLinkMapper projectLinkMapper;
    private final ProjectMediaMapper projectMediaMapper;

    public ProjectMapper(
            TechnologyMapper technologyMapper,
            ProjectLinkMapper projectLinkMapper,
            ProjectMediaMapper projectMediaMapper
    ) {
        this.technologyMapper = technologyMapper;
        this.projectLinkMapper = projectLinkMapper;
        this.projectMediaMapper = projectMediaMapper;
    }

    public ProjectResponse toResponse(
            Project project
    ) {

        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getDisplayOrder(),

                project.getLinks()
                        .stream()
                        .map(projectLinkMapper::toResponse)
                        .toList(),

                project.getCreatedAt(),

                project.getTechnologies()
                        .stream()
                        .map(technologyMapper::toResponse)
                        .toList(),

                project.getMedia()
                        .stream()
                        .map(projectMediaMapper::toResponse)
                        .toList()
        );
    }
}