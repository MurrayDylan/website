package ie.dylanmurray.website.dto.projectlink;

public class ProjectLinkResponse {

    private Long id;
    private String label;
    private String url;

    public ProjectLinkResponse() {
    }

    public ProjectLinkResponse(Long id, String label, String url) {
        this.id = id;
        this.label = label;
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public String getUrl() {
        return url;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
