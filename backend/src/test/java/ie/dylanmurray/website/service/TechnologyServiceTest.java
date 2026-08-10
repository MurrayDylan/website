package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.technology.TechnologyRequest;
import ie.dylanmurray.website.dto.technology.TechnologyResponse;
import ie.dylanmurray.website.entity.Technology;
import ie.dylanmurray.website.mapper.TechnologyMapper;
import ie.dylanmurray.website.repository.TechnologyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class TechnologyServiceTest {

    @Mock
    private TechnologyRepository technologyRepository;

    @Mock
    private TechnologyMapper technologyMapper;

    @InjectMocks
    private TechnologyService technologyService;


    @Test
    void shouldCreateTechnology() {

        TechnologyRequest request =
                new TechnologyRequest(
                        "React",
                        "Frontend"
                );

        Technology technology =
                new Technology(
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
                technologyRepository.existsByName("React")
        ).thenReturn(false);

        when(
                technologyRepository.save(any(Technology.class))
        ).thenReturn(technology);

        when(
                technologyMapper.toResponse(technology)
        ).thenReturn(response);

        TechnologyResponse result =
                technologyService.createTechnology(
                        request
                );

        assertEquals(
                "React",
                result.getName()
        );

        assertEquals(
                "Frontend",
                result.getCategory()
        );

        verify(
                technologyRepository
        ).save(any(Technology.class));
    }


    @Test
    void shouldFindExistingTechnology() {

        Technology technology =
                new Technology(
                        "React",
                        "Frontend"
                );

        when(
                technologyRepository.findByName("React")
        ).thenReturn(
                Optional.of(technology)
        );

        Technology result =
                technologyService.findOrCreate(
                        "React"
                );

        assertSame(
                technology,
                result
        );

        verify(
                technologyRepository,
                never()
        ).save(any());
    }


    @Test
    void shouldCreateMissingTechnologyAsOther() {

        when(
                technologyRepository.findByName("Docker")
        ).thenReturn(
                Optional.empty()
        );

        Technology savedTechnology =
                new Technology(
                        "Docker"
                );

        when(
                technologyRepository.save(any(Technology.class))
        ).thenReturn(savedTechnology);

        Technology result =
                technologyService.findOrCreate(
                        "Docker"
                );

        assertEquals(
                "Docker",
                result.getName()
        );

        assertEquals(
                "Other",
                result.getCategory()
        );

        verify(
                technologyRepository
        ).save(any(Technology.class));
    }


    @Test
    void shouldRejectDuplicateTechnology() {

        TechnologyRequest request =
                new TechnologyRequest(
                        "React",
                        "Frontend"
                );

        when(
                technologyRepository.existsByName("React")
        ).thenReturn(true);

        assertThrows(
                IllegalArgumentException.class,
                () -> technologyService.createTechnology(
                        request
                )
        );

        verify(
                technologyRepository,
                never()
        ).save(any());
    }


    @Test
    void shouldUpdateTechnology() {

        Technology technology =
                new Technology(
                        "React",
                        "Other"
                );

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
                technologyRepository.findById(1L)
        ).thenReturn(
                Optional.of(technology)
        );

        when(
                technologyRepository.findByName("React")
        ).thenReturn(
                Optional.of(technology)
        );

        when(
                technologyMapper.toResponse(technology)
        ).thenReturn(response);

        TechnologyResponse result =
                technologyService.updateTechnology(
                        1L,
                        request
                );

        assertEquals(
                "React",
                result.getName()
        );

        assertEquals(
                "Frontend",
                result.getCategory()
        );

        assertEquals(
                "Frontend",
                technology.getCategory()
        );
    }


    @Test
    void shouldDeleteTechnology() {

        Technology technology =
                new Technology(
                        "React",
                        "Frontend"
                );

        when(
                technologyRepository.findById(1L)
        ).thenReturn(
                Optional.of(technology)
        );

        technologyService.deleteTechnology(1L);

        verify(
                technologyRepository
        ).delete(technology);
    }
}