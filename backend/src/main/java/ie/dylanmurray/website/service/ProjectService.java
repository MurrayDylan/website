package ie.dylanmurray.website.service;


import ie.dylanmurray.website.dto.project.ProjectRequest;
import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.entity.Project;
import ie.dylanmurray.website.entity.Technology;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.ProjectMapper;
import ie.dylanmurray.website.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TechnologyService technologyService;
    private final ProjectMapper projectMapper;

    public ProjectService(
            ProjectRepository projectRepository,
            TechnologyService technologyService,
            ProjectMapper projectMapper
    ) {
        this.projectRepository = projectRepository;
        this.technologyService = technologyService;
        this.projectMapper = projectMapper;
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository
                .findAll()
                .stream()
                .map(projectMapper::toResponse)
                .toList();

    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository
                .findById(id)
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                            "Project not found with id: " + id
                    )
                );

        return projectMapper.toResponse(project);

    }

    @Transactional
    public ProjectResponse createProject(
            ProjectRequest request
    ) {
        Project project = new Project(
                request.getTitle(),
                request.getDescription(),
                request.getProjectUrl()
        );

        for(String technologyName : request.getTechnologies()) {

            Technology technology =
                    technologyService.findOrCreate(
                            technologyName
                    );

            project.addTechnology(technology);
        }

        Project savedProject = projectRepository.save(project);

        return projectMapper.toResponse(savedProject);

    }
}