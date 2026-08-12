package ie.dylanmurray.website.dto.media;

public class MediaHashCheckResponse {

    private boolean exists;
    private MediaResponse media;

    public MediaHashCheckResponse(
            boolean exists,
            MediaResponse media
    ) {
        this.exists = exists;
        this.media = media;
    }

    public boolean isExists() {
        return exists;
    }

    public MediaResponse getMedia() {
        return media;
    }
}