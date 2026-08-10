package ie.dylanmurray.website.dto.projectlink;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProjectLinkRequest {

    @NotBlank
    @Size(max = 100)
    private String label;

    @NotBlank
    private String url;

    public ProjectLinkRequest() {
    }

    public ProjectLinkRequest(String label, String url) {
        this.label = label;
        this.url = url;
    }

    public String getLabel() {
        return label;
    }

    public @NotBlank String getUrl() {
        return url;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setUrl(String url) {
        this.url = url;
    }

}