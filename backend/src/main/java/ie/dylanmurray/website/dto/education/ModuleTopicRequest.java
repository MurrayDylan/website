package ie.dylanmurray.website.dto.education;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ModuleTopicRequest {

    public ModuleTopicRequest() {
    }

    public ModuleTopicRequest(String title, Integer displayOrder) {
        this.title = title;
        this.displayOrder = displayOrder;
    }

    @NotBlank(message = "Topic title cannot be empty")
    @Size(max = 300, message = "Topic title cannot exceed 300 characters")
    private String title;

    private Integer displayOrder;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}