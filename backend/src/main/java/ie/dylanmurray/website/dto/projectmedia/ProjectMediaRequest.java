package ie.dylanmurray.website.dto.projectmedia;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProjectMediaRequest(

        @NotNull
        Long mediaId,

        @NotNull
        @PositiveOrZero
        Integer displayOrder,

        String caption,

        String altText

) {
}