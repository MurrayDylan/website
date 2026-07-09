package ie.dylanmurray.website.service;

import ie.dylanmurray.website.entity.Technology;
import ie.dylanmurray.website.repository.TechnologyRepository;
import org.springframework.stereotype.Service;

@Service
public class TechnologyService {


    private final TechnologyRepository technologyRepository;


    public TechnologyService(
            TechnologyRepository technologyRepository
    ) {
        this.technologyRepository = technologyRepository;
    }


    public Technology findOrCreate(String name) {


        return technologyRepository
                .findByName(name)
                .orElseGet(() -> {

                    Technology technology = new Technology(name);

                    return technologyRepository.save(technology);

                });
    }
}