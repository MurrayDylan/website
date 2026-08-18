package ie.dylanmurray.website.dto.workmedia;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class WorkMediaRequest {

    @NotNull
    private Long mediaId;

    @NotNull
    @PositiveOrZero
    private Integer displayOrder;

    private String caption;
    private String altText;
    private Boolean isHorizontal;

    public WorkMediaRequest() {
    }

    public WorkMediaRequest(
            Long mediaId,
            Integer displayOrder,
            String caption,
            String altText,
            Boolean isHorizontal
    ) {
        this.mediaId = mediaId;
        this.displayOrder = displayOrder;
        this.caption = caption;
        this.altText = altText;
        this.isHorizontal = isHorizontal;
    }

    public Long getMediaId() {
        return mediaId;
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

    public void setMediaId(Long mediaId) {
        this.mediaId = mediaId;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public void setIsHorizontal(Boolean horizontal) {
        isHorizontal = horizontal;
    }
}