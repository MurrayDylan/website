package ie.dylanmurray.website.dto.education;

import java.util.List;


public class ModuleResponse {

    private Long id;

    private String name;

    private String grade;

    private String description;

    private Integer displayOrder;

    private List<ModuleTopicResponse> topics;


    public ModuleResponse(
            Long id,
            String name,
            String grade,
            String description,
            Integer displayOrder,
            List<ModuleTopicResponse> topics
    ) {
        this.id = id;
        this.name = name;
        this.grade = grade;
        this.description = description;
        this.displayOrder = displayOrder;
        this.topics = topics;
    }


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getGrade() {
        return grade;
    }

    public String getDescription() {
        return description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public List<ModuleTopicResponse> getTopics() {
        return topics;
    }
}