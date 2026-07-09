package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.entity.Project;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProjectMapper {


    private final TechnologyMapper technologyMapper;


    public ProjectMapper(
            TechnologyMapper technologyMapper
    ) {
        this.technologyMapper = technologyMapper;
    }


    public ProjectResponse toResponse(Project project) {


        return new ProjectResponse(

                project.getId(),

                project.getTitle(),

                project.getDescription(),

                project.getProjectUrl(),

                project.getCreatedAt(),

                project.getTechnologies()
                        .stream()
                        .map(technologyMapper::toResponse)
                        .collect(Collectors.toList())

        );
    }
}