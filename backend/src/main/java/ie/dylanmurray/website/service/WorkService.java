package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.work.WorkRequest;
import ie.dylanmurray.website.dto.work.WorkResponse;
import ie.dylanmurray.website.entity.Technology;
import ie.dylanmurray.website.entity.Work;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.WorkMapper;
import ie.dylanmurray.website.repository.TechnologyRepository;
import ie.dylanmurray.website.repository.WorkRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;


@Service
public class WorkService {


    private final WorkRepository workRepository;
    private final TechnologyRepository technologyRepository;
    private final WorkMapper workMapper;


    public WorkService(
            WorkRepository workRepository,
            TechnologyRepository technologyRepository,
            WorkMapper workMapper
    ) {
        this.workRepository = workRepository;
        this.technologyRepository = technologyRepository;
        this.workMapper = workMapper;
    }


    public List<WorkResponse> getAllWork() {

        return workRepository.findAllOrdered()
                .stream()
                .map(workMapper::toResponse)
                .toList();
    }


    public WorkResponse getWorkById(Long id) {

        Work work = workRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work experience not found with id: " + id
                        )
                );

        return workMapper.toResponse(work);
    }


    public WorkResponse createWork(WorkRequest request) {

        Set<Technology> technologies =
                findTechnologies(request.technologyIds());

        Work work = new Work(
                request.companyName(),
                request.jobTitle(),
                request.startDate(),
                request.endDate(),
                request.current(),
                request.location(),
                request.companyWebsite(),
                request.companyLogo(),
                request.description(),
                request.displayOrder()
        );

        work.replaceTechnologies(technologies);

        Work savedWork = workRepository.save(work);

        return workMapper.toResponse(savedWork);
    }


    public WorkResponse updateWork(Long id, WorkRequest request) {

        Work work = workRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work experience not found with id: " + id
                        )
                );

        Set<Technology> technologies =
                findTechnologies(request.technologyIds());

        work.update(
                request.companyName(),
                request.jobTitle(),
                request.startDate(),
                request.endDate(),
                request.current(),
                request.location(),
                request.companyWebsite(),
                request.companyLogo(),
                request.description(),
                request.displayOrder()
        );

        work.replaceTechnologies(technologies);

        Work savedWork = workRepository.save(work);

        return workMapper.toResponse(savedWork);
    }


    public void deleteWork(Long id) {

        Work work = workRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work experience not found with id: " + id
                        )
                );

        workRepository.delete(work);
    }


    private Set<Technology> findTechnologies(Set<Long> technologyIds) {

        if (technologyIds == null || technologyIds.isEmpty()) {
            return Set.of();
        }

        List<Technology> technologies =
                technologyRepository.findAllById(technologyIds);

        if (technologies.size() != technologyIds.size()) {
            throw new ResourceNotFoundException(
                    "One or more technologies could not be found"
            );
        }

        return Set.copyOf(technologies);
    }
}