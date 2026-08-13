package ie.dylanmurray.website.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;

public interface MediaStorageService {

    String store(
            MultipartFile file,
            String storageKey
    ) throws IOException;

    String store(
            MultipartFile file,
            String storageKey,
            boolean replaceExisting
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