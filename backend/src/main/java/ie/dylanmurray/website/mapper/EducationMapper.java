package ie.dylanmurray.website.mapper;


import ie.dylanmurray.website.dto.education.*;
import ie.dylanmurray.website.entity.*;
import org.springframework.stereotype.Component;


@Component
public class EducationMapper {


    public EducationResponse toResponse(
            Education education
    ) {

        return new EducationResponse(

                education.getId(),

                education.getInstitution(),

                education.getLocation(),

                education.getQualification(),

                education.getFieldOfStudy(),

                education.getStartDate(),

                education.getEndDate(),

                education.isCurrent(),

                education.getGrade(),

                education.getDescription(),

                education.getDisplayOrder(),

                education.getModules()
                        .stream()
                        .map(m -> moduleToResponse(m))
                        .toList()
        );
    }



    private ModuleResponse moduleToResponse(
            ie.dylanmurray.website.entity.Module module
    ) {

        return new ModuleResponse(

                module.getId(),

                module.getName(),

                module.getGrade(),

                module.getDescription(),

                module.getDisplayOrder(),

                module.getTopics()
                        .stream()
                        .map(topic ->
                                new ModuleTopicResponse(
                                        topic.getId(),
                                        topic.getTitle(),
                                        topic.getDisplayOrder()
                                )
                        )
                        .toList()
        );
    }
}