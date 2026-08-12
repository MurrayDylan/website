package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.project.ProjectRequest;
import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.dto.projectlink.ProjectLinkRequest;
import ie.dylanmurray.website.entity.Project;
import ie.dylanmurray.website.entity.Technology;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.ProjectMapper;
import ie.dylanmurray.website.repository.ProjectRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TechnologyService technologyService;

    @Mock
    private ProjectMapper projectMapper;

    @InjectMocks
    private ProjectService projectService;


    @Test
    void shouldReturnProjectWhenIdExists() {

        // Arrange

        Project project =
                new Project(
                        "Portfolio",
                        "My website"
                );

        ProjectResponse response =
                new ProjectResponse(
                        1L,
                        "Portfolio",
                        "My website",
                        List.of(),
                        null,
                        List.of(),
                        List.of()
                );

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(projectMapper.toResponse(project))
                .thenReturn(response);


        // Act

        ProjectResponse result =
                projectService.getProjectById(1L);


        // Assert

        assertEquals(
                "Portfolio",
                result.getTitle()
        );

        verify(projectRepository)
                .findById(1L);
    }


    @Test
    void shouldThrowExceptionWhenProjectDoesNotExist() {

        // Arrange

        when(projectRepository.findById(99L))
                .thenReturn(Optional.empty());


        // Act + Assert

        assertThrows(
                ResourceNotFoundException.class,
                () ->
                        projectService.getProjectById(99L)
        );

        verify(projectRepository)
                .findById(99L);
    }


    @Test
    void shouldCreateProjectSuccessfully() {

        // Arrange

        ProjectRequest request =
                new ProjectRequest(
                        "Portfolio",
                        "Website project",
                        List.of(
                                new ProjectLinkRequest(
                                        "GitHub",
                                        "https://github.com/test"
                                )
                        ),
                        List.of("Java")
                );

        Technology java =
                new Technology("Java");

        Project savedProject =
                new Project(
                        "Portfolio",
                        "Website project"
                );

        ProjectResponse response =
                new ProjectResponse(
                        1L,
                        "Portfolio",
                        "My website",
                        List.of(),
                        null,
                        List.of(),
                        List.of()
                );

        when(technologyService.findOrCreate("Java"))
                .thenReturn(java);

        when(projectRepository.save(any(Project.class)))
                .thenReturn(savedProject);

        when(projectMapper.toResponse(savedProject))
                .thenReturn(response);


        // Act

        ProjectResponse result =
                projectService.createProject(request);


        // Assert

        assertEquals(
                "Portfolio",
                result.getTitle()
        );

        verify(technologyService)
                .findOrCreate("Java");

        verify(projectRepository)
                .save(any(Project.class));

        verify(projectMapper)
                .toResponse(savedProject);
    }


    @Test
    void shouldCreateProjectWithoutTechnologies() {

        // Arrange

        ProjectRequest request =
                new ProjectRequest(
                        "Portfolio",
                        "Website project",
                        List.of(
                                new ProjectLinkRequest(
                                        "GitHub",
                                        "https://github.com/test"
                                )
                        ),
                        List.of()
                );

        Project savedProject =
                new Project(
                        "Portfolio",
                        "Website project"
                );

        ProjectResponse response =
                new ProjectResponse(
                        1L,
                        "Portfolio",
                        "My website",
                        List.of(),
                        null,
                        List.of(),
                        List.of()
                );

        when(projectRepository.save(any(Project.class)))
                .thenReturn(savedProject);

        when(projectMapper.toResponse(savedProject))
                .thenReturn(response);


        // Act

        ProjectResponse result =
                projectService.createProject(request);


        // Assert

        assertEquals(
                "Portfolio",
                result.getTitle()
        );

        verify(projectRepository)
                .save(any(Project.class));

        verify(projectMapper)
                .toResponse(savedProject);

        verifyNoInteractions(technologyService);
    }


    @Test
    void shouldDeleteProjectSuccessfully() {

        // Arrange

        Project project =
                new Project(
                        "Portfolio",
                        "Website"
                );

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));


        // Act

        projectService.deleteProject(1L);


        // Assert

        verify(projectRepository)
                .delete(project);
    }


    @Test
    void shouldThrowExceptionWhenDeletingNonexistentProject() {

        // Arrange

        when(projectRepository.findById(99L))
                .thenReturn(Optional.empty());


        // Act + Assert

        assertThrows(
                ResourceNotFoundException.class,
                () ->
                        projectService.deleteProject(99L)
        );

        verify(projectRepository)
                .findById(99L);

        verify(projectRepository, never())
                .delete(any(Project.class));
    }
}
