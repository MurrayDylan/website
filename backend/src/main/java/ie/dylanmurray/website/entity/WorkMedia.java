package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "work_media",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_work_media_work_media",
                        columnNames = {"work_id", "media_id"}
                )
        }
)
public class WorkMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "work_id",
            nullable = false
    )
    private Work work;

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

    protected WorkMedia() {
    }

    public WorkMedia(
            Work work,
            Media media,
            Integer displayOrder,
            String caption,
            String altText
    ) {
        this.work = work;
        this.media = media;
        this.displayOrder = displayOrder;
        this.caption = caption;
        this.altText = altText;
    }

    public Long getId() {
        return id;
    }

    public Work getWork() {
        return work;
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

    public void setWork(
            Work work
    ) {
        this.work = work;
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