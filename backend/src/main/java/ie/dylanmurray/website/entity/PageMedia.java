package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "page_media",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_page_media_page_media",
                        columnNames = {"page_id", "media_id"}
                )
        }
)
public class PageMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "page_id",
            nullable = false
    )
    private Page page;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "media_id",
            nullable = false
    )
    private Media media;

    @Column(
            name = "display_order",
            nullable = false
    )
    private Integer displayOrder;

    @Column(
            columnDefinition = "TEXT"
    )
    private String caption;

    @Column(
            name = "alt_text",
            columnDefinition = "TEXT"
    )
    private String altText;

    protected PageMedia() {
    }

    public PageMedia(
            Page page,
            Media media,
            Integer displayOrder,
            String caption,
            String altText
    ) {
        this.page = page;
        this.media = media;
        this.displayOrder = displayOrder;
        this.caption = caption;
        this.altText = altText;
    }

    public Long getId() {
        return id;
    }

    public Page getPage() {
        return page;
    }

    public Media getMedia() {
        return media;
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

    public void setPage(
            Page page
    ) {
        this.page = page;
    }

    public void setMedia(
            Media media
    ) {
        this.media = media;
    }

    public void setDisplayOrder(
            Integer displayOrder
    ) {
        this.displayOrder = displayOrder;
    }

    public void setCaption(
            String caption
    ) {
        this.caption = caption;
    }

    public void setAltText(
            String altText
    ) {
        this.altText = altText;
    }

    public void update(
            Integer displayOrder,
            String caption,
            String altText
    ) {
        this.displayOrder = displayOrder;
        this.caption = caption;
        this.altText = altText;
    }
}