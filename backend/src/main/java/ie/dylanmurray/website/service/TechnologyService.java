package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.technology.TechnologyRequest;
import ie.dylanmurray.website.dto.technology.TechnologyResponse;
import ie.dylanmurray.website.entity.Technology;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.TechnologyMapper;
import ie.dylanmurray.website.repository.TechnologyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class TechnologyService {

    private final TechnologyRepository technologyRepository;
    private final TechnologyMapper technologyMapper;

    public TechnologyService(
            TechnologyRepository technologyRepository,
            TechnologyMapper technologyMapper
    ) {
        this.technologyRepository = technologyRepository;
        this.technologyMapper = technologyMapper;
    }

    @Transactional(readOnly = true)
    public List<TechnologyResponse> getAllTechnologies() {

        return technologyRepository
                .findAll()
                .stream()
                .map(technologyMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TechnologyResponse getTechnologyById(
            Long id
    ) {

        Technology technology =
                technologyRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Technology not found with id: " + id
                                )
                        );

        return technologyMapper.toResponse(technology);
    }

    @Transactional
    public TechnologyResponse createTechnology(
            TechnologyRequest request
    ) {

        if (technologyRepository
                .existsByName(request.getName())) {

            throw new IllegalArgumentException(
                    "Technology already exists with name: "
                            + request.getName()
            );
        }

        Technology technology = new Technology(
                request.getName(),
                request.getCategory()
        );

        Technology savedTechnology =
                technologyRepository.save(technology);

        return technologyMapper.toResponse(
                savedTechnology
        );
    }

    @Transactional
    public TechnologyResponse updateTechnology(
            Long id,
            TechnologyRequest request
    ) {

        Technology technology =
                technologyRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Technology not found with id: " + id
                                )
                        );

        technologyRepository
                .findByName(request.getName())
                .ifPresent(existingTechnology -> {

                    if (!existingTechnology
                            .getId()
                            .equals(id)) {

                        throw new IllegalArgumentException(
                                "Technology already exists with name: "
                                        + request.getName()
                        );
                    }
                });

        technology.update(
                request.getName(),
                request.getCategory()
        );

        return technologyMapper.toResponse(
                technology
        );
    }

    @Transactional
    public void deleteTechnology(
            Long id
    ) {

        Technology technology =
                technologyRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Technology not found with id: " + id
                                )
                        );

        technologyRepository.delete(technology);
    }

    @Transactional
    public Technology findOrCreate(
            String name
    ) {

        return technologyRepository
                .findByName(name)
                .orElseGet(() -> {

                    Technology technology =
                            new Technology(name);

                    return technologyRepository.save(
                            technology
                    );
                });
    }
}