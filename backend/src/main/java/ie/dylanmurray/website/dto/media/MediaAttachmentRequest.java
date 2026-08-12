package ie.dylanmurray.website.dto.media;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MediaAttachmentRequest(

        @NotNull
        @Min(0)
        Integer displayOrder,

        String caption,

        String altText

) {
}