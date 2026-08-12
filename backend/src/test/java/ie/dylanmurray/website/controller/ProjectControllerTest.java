package ie.dylanmurray.website.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ie.dylanmurray.website.controller.ProjectController;
import ie.dylanmurray.website.dto.project.ProjectRequest;
import ie.dylanmurray.website.dto.project.ProjectResponse;
import ie.dylanmurray.website.dto.projectlink.ProjectLinkRequest;
import ie.dylanmurray.website.service.ProjectService;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ProjectService projectService;


    @Test
    void shouldReturnProjectsPublicly()
            throws Exception {

        when(projectService.getAllProjects())
                .thenReturn(List.of());

        mockMvc.perform(
                        get("/api/projects")
                )
                .andExpect(
                        status().isOk()
                );

        verify(projectService)
                .getAllProjects();
    }


    @Test
    @WithMockUser(
            username = "dylan",
            roles = "ADMIN"
    )
    void adminShouldCreateProject()
            throws Exception {

        ProjectRequest request =
                new ProjectRequest(
                        "Portfolio",
                        "My website",
                        List.of(
                                new ProjectLinkRequest(
                                        "GitHub",
                                        "https://github.com/test"
                                )
                        ),
                        List.of("Java")
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

        when(projectService.createProject(any()))
                .thenReturn(response);

        mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.title")
                                .value("Portfolio")
                );

        verify(projectService)
                .createProject(any());
    }


    @Test
    void anonymousUserCannotCreateProject()
            throws Exception {

        ProjectRequest request =
                new ProjectRequest(
                        "Portfolio",
                        "My website",
                        List.of(
                                new ProjectLinkRequest(
                                        "GitHub",
                                        "https://github.com/test"
                                )
                        ),
                        List.of("Java")
                );

        mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(
                        status().isUnauthorized()
                );

        verifyNoInteractions(projectService);
    }


    @Test
    @WithMockUser(
            roles = "USER"
    )
    void normalUserCannotCreateProject()
            throws Exception {

        ProjectRequest request =
                new ProjectRequest(
                        "Portfolio",
                        "My website",
                        List.of(
                                new ProjectLinkRequest(
                                        "GitHub",
                                        "https://github.com/test"
                                )
                        ),
                        List.of("Java")
                );

        mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(
                        status().isForbidden()
                );

        verifyNoInteractions(projectService);
    }


    @Test
    @WithMockUser(
            roles = "ADMIN"
    )
    void invalidProjectRequestReturnsBadRequest()
            throws Exception {

        ProjectRequest request =
                new ProjectRequest(
                        "",
                        "Description",
                        List.of(
                                new ProjectLinkRequest(
                                        "GitHub",
                                        "https://github.com/test"
                                )
                        ),
                        List.of()
                );

        mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(
                        status().isBadRequest()
                );

        verifyNoInteractions(projectService);
    }


    @Test
    @WithMockUser(
            roles = "ADMIN"
    )
    void adminShouldCreateProjectWithoutTechnologies()
            throws Exception {

        ProjectRequest request =
                new ProjectRequest(
                        "Portfolio",
                        "My website",
                        List.of(
                                new ProjectLinkRequest(
                                        "GitHub",
                                        "https://github.com/test"
                                )
                        ),
                        List.of()
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

        when(projectService.createProject(any()))
                .thenReturn(response);

        mockMvc.perform(
                        post("/api/projects")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(request)
                                )
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.title")
                                .value("Portfolio")
                );

        verify(projectService)
                .createProject(any());
    }
}
