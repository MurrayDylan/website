package ie.dylanmurray.website.dto.page;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.Map;

public record PageRequest(

        @NotBlank
        @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug must be lowercase alphanumeric with hyphens")
        String slug,

        @NotBlank
        String title,

        String subtitle,

        @NotNull
        String layoutType,

        String content,

        Map<String, Object> metadata

) {}