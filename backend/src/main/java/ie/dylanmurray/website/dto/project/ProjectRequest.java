package ie.dylanmurray.website.dto.project;

import ie.dylanmurray.website.dto.projectlink.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class ProjectRequest {

    @NotBlank(message = "Title cannot be empty")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @Size(max = 3000, message = "Description cannot exceed 3000 characters")
    private String description;

    private Integer displayOrder;

    @Valid
    private List<ProjectLinkRequest> links = new ArrayList<>();

    private List<String> technologies = new ArrayList<>();

    public ProjectRequest() {
    }

    public ProjectRequest(
            String title,
            String description,
            Integer displayOrder,
            List<ProjectLinkRequest> links,
            List<String> technologies
    ) {
        this.title = title;
        this.description = description;
        this.displayOrder = displayOrder;
        this.links = links;
        this.technologies = technologies;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public List<ProjectLinkRequest> getLinks() {
        return links;
    }

    public List<String> getTechnologies() {
        return technologies;
    }
}