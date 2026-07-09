package ie.dylanmurray.website.dto.project;


public class ProjectRequest {

    private String title;
    private String description;
    private String projectUrl;

    public ProjectRequest() {

    }

    public ProjectRequest(
            String title,
            String description,
            String projectUrl
    ) {
        this.title = title;
        this.description = description;
        this.projectUrl = projectUrl;
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
}