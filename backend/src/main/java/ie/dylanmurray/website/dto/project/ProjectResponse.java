package ie.dylanmurray.website.dto.project;

import ie.dylanmurray.website.dto.projectmedia.ProjectMediaResponse;
import ie.dylanmurray.website.dto.projectlink.ProjectLinkResponse;
import ie.dylanmurray.website.dto.technology.TechnologyResponse;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {

    private Long id;

    private String title;

    private String description;

    private Integer displayOrder;

    private List<ProjectLinkResponse> links;

    private LocalDateTime createdAt;

    private List<TechnologyResponse> technologies;

    private List<ProjectMediaResponse> media;

    public ProjectResponse(
            Long id,
            String title,
            String description,
            Integer displayOrder,
            List<ProjectLinkResponse> links,
            LocalDateTime createdAt,
            List<TechnologyResponse> technologies,
            List<ProjectMediaResponse> media
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.displayOrder = displayOrder;
        this.links = links;
        this.createdAt = createdAt;
        this.technologies = technologies;
        this.media = media;
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

    public Integer getDisplayOrder() {
        return displayOrder;
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

    public List<ProjectMediaResponse> getMedia() {
        return media;
    }
}