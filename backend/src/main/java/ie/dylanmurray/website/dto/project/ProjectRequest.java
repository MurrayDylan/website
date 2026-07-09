package ie.dylanmurray.website.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class ProjectRequest {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    private String description;

    private String projectUrl;

    @NotEmpty(message = "Technologies must have atleast one technology")
    private List<String> technologies;

    public ProjectRequest() {
    }

    public ProjectRequest(
            String title,
            String description,
            String projectUrl,
            List<String> technologies
    ) {
        this.title = title;
        this.description = description;
        this.projectUrl = projectUrl;
        this.technologies = technologies;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public List<String> getTechnologies() {
        return technologies;
    }
}