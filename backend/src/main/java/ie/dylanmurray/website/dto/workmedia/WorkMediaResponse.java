package ie.dylanmurray.website.dto.workmedia;

import ie.dylanmurray.website.dto.media.MediaResponse;

public record WorkMediaResponse(

        Long id,

        Integer displayOrder,

        String caption,

        String altText,

        Boolean isHorizontal,

        MediaResponse media

) {
}