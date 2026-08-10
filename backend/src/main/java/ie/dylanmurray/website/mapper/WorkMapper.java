package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.technology.TechnologyResponse;
import ie.dylanmurray.website.dto.work.WorkResponse;
import ie.dylanmurray.website.entity.Work;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;


@Component
public class WorkMapper {


    private final TechnologyMapper technologyMapper;


    public WorkMapper(TechnologyMapper technologyMapper) {
        this.technologyMapper = technologyMapper;
    }


    public WorkResponse toResponse(Work work) {

        return new WorkResponse(
                work.getId(),
                work.getCompanyName(),
                work.getJobTitle(),
                work.getStartDate(),
                work.getEndDate(),
                work.isCurrent(),
                work.getLocation(),
                work.getCompanyWebsite(),
                work.getCompanyLogo(),
                work.getDescription(),
                work.getDisplayOrder(),
                work.getTechnologies()
                        .stream()
                        .map(technologyMapper::toResponse)
                        .collect(Collectors.toSet())
        );
    }
}