package ie.dylanmurray.website.service;

import ie.dylanmurray.website.config.MediaStorageProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalMediaStorageService implements MediaStorageService {

    private final Path storageRoot;

    public LocalMediaStorageService(
            MediaStorageProperties properties
    ) {
        this.storageRoot = Paths
                .get(properties.getLocation())
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(storageRoot);
        } catch (IOException e) {
            throw new IllegalStateException(
                    "Could not create media storage directory: "
                            + storageRoot,
                    e
            );
        }
    }

    @Override
    public String store(
            MultipartFile file,
            String storageKey
    ) throws IOException {
        return store(file, storageKey, false);
    }

    @Override
    public String store(
            MultipartFile file,
            String storageKey,
            boolean replaceExisting
    ) throws IOException {

        Path target = resolveStorageKey(storageKey);

        Path parent = target.getParent();

        if (parent != null) {
            Files.createDirectories(parent);
        }

        try (InputStream inputStream = file.getInputStream()) {
            if (replaceExisting) {
                Files.copy(
                        inputStream,
                        target,
                        StandardCopyOption.REPLACE_EXISTING
                );
            } else {
                Files.copy(
                        inputStream,
                        target
                );
            }
        }

        return storageKey;
    }

    @Override
    public InputStream load(
            String storageKey
    ) throws IOException {

        Path path = resolveStorageKey(storageKey);

        return Files.newInputStream(path);
    }

    @Override
    public void delete(
            String storageKey
    ) throws IOException {

        Path path = resolveStorageKey(storageKey);

        Files.deleteIfExists(path);
    }

    @Override
    public boolean exists(
            String storageKey
    ) {

        Path path = resolveStorageKey(storageKey);

        return Files.exists(path);
    }

    @Override
    public Path getPath(
            String storageKey
    ) {

        return resolveStorageKey(storageKey);
    }

    private Path resolveStorageKey(
            String storageKey
    ) {

        if (storageKey == null || storageKey.isBlank()) {
            throw new IllegalArgumentException(
                    "Storage key must not be null or blank"
            );
        }

        Path resolved = storageRoot
                .resolve(storageKey)
                .normalize();

        if (!resolved.startsWith(storageRoot)) {
            throw new IllegalArgumentException(
                    "Invalid storage key: " + storageKey
            );
        }

        return resolved;
    }
}