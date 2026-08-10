package ie.dylanmurray.website.dto.technology;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class TechnologyRequest {

    @NotBlank(message = "Name cannot be empty")
    @Size(
            max = 50,
            message = "Name cannot exceed 50 characters"
    )
    private String name;

    @NotBlank(message = "Category cannot be empty")
    @Size(
            max = 100,
            message = "Category cannot exceed 100 characters"
    )
    private String category;

    public TechnologyRequest() {
    }

    public TechnologyRequest(
            String name,
            String category
    ) {
        this.name = name;
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }
}