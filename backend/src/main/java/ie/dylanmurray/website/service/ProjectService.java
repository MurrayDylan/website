package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.project.ProjectRequest;
import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.dto.projectlink.ProjectLinkRequest;
import ie.dylanmurray.website.entity.Project;
import ie.dylanmurray.website.entity.ProjectLink;
import ie.dylanmurray.website.entity.Technology;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.ProjectMapper;
import ie.dylanmurray.website.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository
                .findAll()
                .stream()
                .map(projectMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
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
                request.getDescription()
        );

        // Add technologies
        for (String technologyName : request.getTechnologies()) {

            Technology technology =
                    technologyService.findOrCreate(
                            technologyName
                    );

            project.addTechnology(technology);
        }

        // Add project links
        for (ProjectLinkRequest linkRequest : request.getLinks()) {

            ProjectLink link = new ProjectLink();

            link.setLabel(linkRequest.getLabel());
            link.setUrl(linkRequest.getUrl());

            project.addLink(link);
        }

        Project savedProject = projectRepository.save(project);

        return projectMapper.toResponse(savedProject);
    }

    @Transactional
    public ProjectResponse updateProject(
            Long id,
            ProjectRequest request
    ) {
        Project project = projectRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        ));

        // Update basic project information
        project.update(
                request.getTitle(),
                request.getDescription()
        );

        // Replace technologies
        Set<Technology> technologies = new HashSet<>();

        for (String technologyName : request.getTechnologies()) {

            technologies.add(
                    technologyService.findOrCreate(
                            technologyName
                    )
            );
        }

        project.replaceTechnologies(technologies);

        // Replace project links
        project.getLinks().clear();

        for (ProjectLinkRequest linkRequest : request.getLinks()) {

            ProjectLink link = new ProjectLink();

            link.setLabel(linkRequest.getLabel());
            link.setUrl(linkRequest.getUrl());

            project.addLink(link);
        }

        return projectMapper.toResponse(project);
    }

    @Transactional
    public void deleteProject(Long id) {

        Project project = projectRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        ));

        projectRepository.delete(project);
    }
}