package ie.dylanmurray.website.dto.education;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ModuleRequest {

    public ModuleRequest() {
    }

    public ModuleRequest(
            String name,
            String grade,
            String description,
            Integer displayOrder,
            List<ModuleTopicRequest> topics
    ) {
        this.name = name;
        this.grade = grade;
        this.description = description;
        this.displayOrder = displayOrder;
        this.topics = topics;
    }

    @NotBlank(message = "Module name cannot be empty")
    @Size(max = 300, message = "Module name cannot exceed 300 characters")
    private String name;

    private String grade;

    @Size(max = 2000, message = "Module description cannot exceed 2000 characters")
    private String description;

    private Integer displayOrder;

    private List<@Valid ModuleTopicRequest> topics;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public List<ModuleTopicRequest> getTopics() {
        return topics;
    }

    public void setTopics(List<ModuleTopicRequest> topics) {
        this.topics = topics;
    }
}