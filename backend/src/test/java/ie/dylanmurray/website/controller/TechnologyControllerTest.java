package ie.dylanmurray.website.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ie.dylanmurray.website.dto.technology.TechnologyRequest;
import ie.dylanmurray.website.dto.technology.TechnologyResponse;
import ie.dylanmurray.website.service.TechnologyService;
import org.junit.jupiter.api.Test;
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


@WebMvcTest(TechnologyController.class)
class TechnologyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    @MockitoBean
    private TechnologyService technologyService;


    @Test
    void shouldReturnTechnologiesPublicly()
            throws Exception {

        when(technologyService.getAllTechnologies())
                .thenReturn(List.of());

        mockMvc.perform(
                        get("/api/technologies")
                )
                .andExpect(
                        status().isOk()
                );

        verify(technologyService)
                .getAllTechnologies();
    }


    @Test
    @WithMockUser(
            username = "dylan",
            roles = "ADMIN"
    )
    void adminShouldCreateTechnology()
            throws Exception {

        TechnologyRequest request =
                new TechnologyRequest(
                        "React",
                        "Frontend"
                );

        TechnologyResponse response =
                new TechnologyResponse(
                        1L,
                        "React",
                        "Frontend"
                );

        when(technologyService.createTechnology(any()))
                .thenReturn(response);

        mockMvc.perform(
                        post("/api/technologies")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isCreated()
                )
                .andExpect(
                        jsonPath("$.name")
                                .value("React")
                )
                .andExpect(
                        jsonPath("$.category")
                                .value("Frontend")
                );

        verify(technologyService)
                .createTechnology(any());
    }


    @Test
    void anonymousUserCannotCreateTechnology()
            throws Exception {

        TechnologyRequest request =
                new TechnologyRequest(
                        "React",
                        "Frontend"
                );

        mockMvc.perform(
                        post("/api/technologies")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isUnauthorized()
                );

        verifyNoInteractions(
                technologyService
        );
    }


    @Test
    @WithMockUser(
            roles = "USER"
    )
    void normalUserCannotCreateTechnology()
            throws Exception {

        TechnologyRequest request =
                new TechnologyRequest(
                        "React",
                        "Frontend"
                );

        mockMvc.perform(
                        post("/api/technologies")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isForbidden()
                );

        verifyNoInteractions(
                technologyService
        );
    }


    @Test
    @WithMockUser(
            roles = "ADMIN"
    )
    void invalidTechnologyRequestReturnsBadRequest()
            throws Exception {

        TechnologyRequest request =
                new TechnologyRequest(
                        "",
                        "Frontend"
                );

        mockMvc.perform(
                        post("/api/technologies")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isBadRequest()
                );

        verifyNoInteractions(
                technologyService
        );
    }


    @Test
    void shouldReturnTechnologyById()
            throws Exception {

        TechnologyResponse response =
                new TechnologyResponse(
                        1L,
                        "React",
                        "Frontend"
                );

        when(
                technologyService.getTechnologyById(1L)
        ).thenReturn(response);

        mockMvc.perform(
                        get("/api/technologies/1")
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.id")
                                .value(1)
                )
                .andExpect(
                        jsonPath("$.name")
                                .value("React")
                )
                .andExpect(
                        jsonPath("$.category")
                                .value("Frontend")
                );

        verify(
                technologyService
        ).getTechnologyById(1L);
    }


    @Test
    @WithMockUser(
            roles = "ADMIN"
    )
    void adminShouldUpdateTechnology()
            throws Exception {

        TechnologyRequest request =
                new TechnologyRequest(
                        "React",
                        "Frontend"
                );

        TechnologyResponse response =
                new TechnologyResponse(
                        1L,
                        "React",
                        "Frontend"
                );

        when(
                technologyService.updateTechnology(
                        eq(1L),
                        any()
                )
        ).thenReturn(response);

        mockMvc.perform(
                        put("/api/technologies/1")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper.writeValueAsString(
                                                request
                                        )
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath("$.name")
                                .value("React")
                )
                .andExpect(
                        jsonPath("$.category")
                                .value("Frontend")
                );

        verify(
                technologyService
        ).updateTechnology(
                eq(1L),
                any()
        );
    }


    @Test
    @WithMockUser(
            roles = "ADMIN"
    )
    void adminShouldDeleteTechnology()
            throws Exception {

        doNothing()
                .when(technologyService)
                .deleteTechnology(1L);

        mockMvc.perform(
                        delete("/api/technologies/1")
                )
                .andExpect(
                        status().isNoContent()
                );

        verify(
                technologyService
        ).deleteTechnology(1L);
    }
}