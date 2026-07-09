package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.technology.TechnologyResponse;
import ie.dylanmurray.website.entity.Technology;
import org.springframework.stereotype.Component;

@Component
public class TechnologyMapper {


    public TechnologyResponse toResponse(Technology technology) {

        return new TechnologyResponse(
                technology.getId(),
                technology.getName()
        );
    }
}