package ie.dylanmurray.website.dto.project;

import ie.dylanmurray.website.dto.technology.TechnologyResponse;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {

    private Long id;

    private String title;

    private String description;

    private String projectUrl;

    private LocalDateTime createdAt;

    private List<TechnologyResponse> technologies;


    public ProjectResponse(
            Long id,
            String title,
            String description,
            String projectUrl,
            LocalDateTime createdAt,
            List<TechnologyResponse> technologies
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.projectUrl = projectUrl;
        this.createdAt = createdAt;
        this.technologies = technologies;
    }


    public Long getId() {
        return id;
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


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public List<TechnologyResponse> getTechnologies() {
        return technologies;
    }
}