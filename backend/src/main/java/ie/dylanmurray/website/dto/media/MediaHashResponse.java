package ie.dylanmurray.website.dto.media;

public record MediaHashResponse(

        boolean exists,

        Long mediaId,

        String originalFilename,

        String contentType,

        Long fileSize

) {
}