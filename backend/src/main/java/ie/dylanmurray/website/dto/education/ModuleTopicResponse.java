package ie.dylanmurray.website.dto.education;


public class ModuleTopicResponse {

    private Long id;

    private String title;

    private Integer displayOrder;


    public ModuleTopicResponse(
            Long id,
            String title,
            Integer displayOrder
    ) {
        this.id = id;
        this.title = title;
        this.displayOrder = displayOrder;
    }


    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }
}