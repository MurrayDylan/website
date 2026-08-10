package ie.dylanmurray.website.dto.project;

import ie.dylanmurray.website.dto.projectlink.ProjectLinkRequest;
import ie.dylanmurray.website.dto.technology.TechnologyResponse;
import ie .dylanmurray.website.dto.projectlink.ProjectLinkResponse;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {

    private Long id;

    private String title;

    private String description;

    private List<ProjectLinkResponse> links;

    private LocalDateTime createdAt;

    private List<TechnologyResponse> technologies;


    public ProjectResponse(
            Long id,
            String title,
            String description,
            List<ProjectLinkResponse> links,
            LocalDateTime createdAt,
            List<TechnologyResponse> technologies
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.links = links;
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


    public List<ProjectLinkResponse> getLinks() {
        return links;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public List<TechnologyResponse> getTechnologies() {
        return technologies;
    }
}