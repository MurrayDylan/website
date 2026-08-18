package ie.dylanmurray.website.dto.pagemedia;

public class PageMediaRequest {

    private Integer displayOrder;
    private String caption;
    private String altText;
    private Boolean isHorizontal;

    public PageMediaRequest() {
    }

    public PageMediaRequest(
            Integer displayOrder,
            String caption,
            String altText,
            Boolean isHorizontal
    ) {
        this.displayOrder = displayOrder;
        this.caption = caption;
        this.altText = altText;
        this.isHorizontal = isHorizontal;
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