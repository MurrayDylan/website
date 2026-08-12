package ie.dylanmurray.website.mapper;

import ie.dylanmurray.website.dto.work.WorkResponse;
import ie.dylanmurray.website.entity.Work;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;


@Component
public class WorkMapper {

    private final TechnologyMapper technologyMapper;
    private final WorkMediaMapper workMediaMapper;

    public WorkMapper(
            TechnologyMapper technologyMapper,
            WorkMediaMapper workMediaMapper
    ) {
        this.technologyMapper = technologyMapper;
        this.workMediaMapper = workMediaMapper;
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
                        .collect(Collectors.toSet()),

                work.getMedia()
                        .stream()
                        .map(workMediaMapper::toResponse)
                        .toList()
        );
    }
}