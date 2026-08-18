package ie.dylanmurray.website.dto.media;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record MediaAttachmentRequest(

        @NotNull
        @PositiveOrZero
        Integer displayOrder,

        String caption,

        String altText,

        Boolean isHorizontal

) {
}