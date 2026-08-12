package ie.dylanmurray.website.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

/**
 * Abstraction for physical media storage.
 *
 * MediaService deals with media/domain logic, while implementations
 * of this interface deal with where the actual binary files are stored.
 *
 * The application currently uses LocalMediaStorageService.
 * A future implementation could use object storage without requiring
 * MediaService to change.
 */
public interface MediaStorageService {

    String store(
            MultipartFile file,
            String storageKey
    ) throws IOException;

    InputStream load(
            String storageKey
    ) throws IOException;

    void delete(
            String storageKey
    ) throws IOException;

    boolean exists(
            String storageKey
    );

    Path getPath(
            String storageKey
    );
}