package ie.dylanmurray.website.dto.pagemedia;

import ie.dylanmurray.website.dto.media.MediaResponse;

public class PageMediaResponse {

    private Long id;
    private Integer displayOrder;
    private String caption;
    private String altText;
    private MediaResponse media;

    public PageMediaResponse(
            Long id,
            Integer displayOrder,
            String caption,
            String altText,
            MediaResponse media
    ) {
        this.id = id;
        this.displayOrder = displayOrder;
        this.caption = caption;
        this.altText = altText;
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

    public MediaResponse getMedia() {
        return media;
    }
}