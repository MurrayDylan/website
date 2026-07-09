package ie.dylanmurray.website.dto.project;

import java.util.List;

public class ProjectRequest {

    private String title;

    private String description;

    private String projectUrl;

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