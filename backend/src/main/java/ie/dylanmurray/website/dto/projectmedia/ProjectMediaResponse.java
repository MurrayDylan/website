package ie.dylanmurray.website.dto.projectmedia;

import ie.dylanmurray.website.dto.media.MediaResponse;

public class ProjectMediaResponse {

    private Long id;
    private Integer displayOrder;
    private String caption;
    private String altText;
    private Boolean isHorizontal;
    private MediaResponse media;

    public ProjectMediaResponse(
            Long id,
            Integer displayOrder,
            String caption,
            String altText,
            Boolean isHorizontal,
            MediaResponse media
    ) {
        this.id = id;
        this.displayOrder = displayOrder;
        this.caption = caption;
        this.altText = altText;
        this.isHorizontal = isHorizontal;
        this.media = media;
    }

    public Long getId() {
        return id;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public String getCaption() {
        return caption;
    }

    public String getAltText() {
        return altText;
    }

    public Boolean getIsHorizontal() {
        return isHorizontal;
    }

    public MediaResponse getMedia() {
        return media;
    }
}