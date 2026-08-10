package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.entity.Project;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProjectMapper {


    private final TechnologyMapper technologyMapper;
    private final ProjectLinkMapper projectLinkMapper;


    public ProjectMapper(
            TechnologyMapper technologyMapper,
            ProjectLinkMapper projectLinkMapper
    ) {
        this.technologyMapper = technologyMapper;
        this.projectLinkMapper = projectLinkMapper;
    }


    public ProjectResponse toResponse(Project project) {


        return new ProjectResponse(

                project.getId(),

                project.getTitle(),

                project.getDescription(),

                project.getLinks().
                        stream()
                        .map(projectLinkMapper::toResponse)
                        .collect(Collectors.toList()),

                project.getCreatedAt(),

                project.getTechnologies()
                        .stream()
                        .map(technologyMapper::toResponse)
                        .collect(Collectors.toList())

        );
    }
}