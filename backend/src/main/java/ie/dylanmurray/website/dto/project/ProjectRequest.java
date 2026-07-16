package ie.dylanmurray.website.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class ProjectRequest {

    @NotBlank(message = "Title cannot be empty")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @Size(max = 3000, message = "Description cannot exceed 3000 characters")
    private String description;

    private String projectUrl;

    @NotEmpty(message = "Technologies must have atleast one technology")
    private List<@NotBlank String> technologies;

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