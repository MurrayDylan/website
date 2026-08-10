package ie.dylanmurray.website.service;


import ie.dylanmurray.website.dto.education.*;
import ie.dylanmurray.website.entity.Education;
import ie.dylanmurray.website.entity.Module;
import ie.dylanmurray.website.entity.ModuleTopic;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.EducationMapper;
import ie.dylanmurray.website.repository.EducationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;


@Service
public class EducationService {


    private final EducationRepository educationRepository;

    private final EducationMapper educationMapper;


    public EducationService(
            EducationRepository educationRepository,
            EducationMapper educationMapper
    ) {
        this.educationRepository = educationRepository;
        this.educationMapper = educationMapper;
    }



    public List<EducationResponse> getAllEducation() {

        return educationRepository
                .findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(educationMapper::toResponse)
                .toList();

    }



    public EducationResponse getEducationById(
            Long id
    ) {


        Education education =
                educationRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Education not found"
                                )
                        );


        return educationMapper.toResponse(education);

    }



    @Transactional
    public EducationResponse createEducation(
            EducationRequest request
    ) {


        Education education = new Education(

                request.getInstitution(),

                request.getQualification(),

                request.getFieldOfStudy(),

                request.getStartDate(),

                request.getEndDate(),

                request.isCurrent(),

                request.getGrade(),

                request.getDescription(),

                request.getDisplayOrder()

        );


        addModules(
                education,
                request.getModules()
        );


        Education savedEducation =
                educationRepository.save(education);

        return educationMapper.toResponse(savedEducation);

    }



    @Transactional
    public EducationResponse updateEducation(
            Long id,
            EducationRequest request
    ) {


        Education education =
                educationRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Education not found"
                                )
                        );


        education.update(

                request.getInstitution(),

                request.getQualification(),

                request.getFieldOfStudy(),

                request.getStartDate(),

                request.getEndDate(),

                request.isCurrent(),

                request.getGrade(),

                request.getDescription(),

                request.getDisplayOrder()

        );


        education.getModules().clear();


        addModules(
                education,
                request.getModules()
        );


        Education updatedEducation =
                educationRepository.save(education);

        return educationMapper.toResponse(updatedEducation);

    }



    @Transactional
    public void deleteEducation(
            Long id
    ) {


        Education education =
                educationRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Education not found"
                                )
                        );


                educationRepository.delete(education);

    }



    private void addModules(
            Education education,
            List<ModuleRequest> moduleRequests
    ) {


        if(moduleRequests == null) {
            return;
        }


        for(ModuleRequest moduleRequest : moduleRequests) {


            Module module = new Module(

                    moduleRequest.getName(),

                    moduleRequest.getGrade(),

                    moduleRequest.getDescription(),

                    moduleRequest.getDisplayOrder()

            );


            addTopics(
                    module,
                    moduleRequest.getTopics()
            );


            education.addModule(module);

        }

    }



    private void addTopics(
            Module module,
            List<ModuleTopicRequest> topicRequests
    ) {


        if(topicRequests == null) {
            return;
        }


        for(ModuleTopicRequest topicRequest : topicRequests) {


            ModuleTopic topic =
                    new ModuleTopic(

                            topicRequest.getTitle(),

                            topicRequest.getDisplayOrder()

                    );


            module.addTopic(topic);

        }

    }

}