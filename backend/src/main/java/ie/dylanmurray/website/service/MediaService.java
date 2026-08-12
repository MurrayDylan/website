package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.media.MediaResponse;
import ie.dylanmurray.website.entity.Media;
import ie.dylanmurray.website.exception.ResourceNotFoundException;
import ie.dylanmurray.website.mapper.MediaMapper;
import ie.dylanmurray.website.repository.MediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaStorageService mediaStorageService;
    private final MediaMapper mediaMapper;

    public MediaService(
            MediaRepository mediaRepository,
            MediaStorageService mediaStorageService,
            MediaMapper mediaMapper
    ) {
        this.mediaRepository = mediaRepository;
        this.mediaStorageService = mediaStorageService;
        this.mediaMapper = mediaMapper;
    }


    @Transactional(readOnly = true)
    public MediaResponse checkHash(
            String sha256Hash
    ) {

        validateHash(sha256Hash);

        return mediaRepository
                .findBySha256Hash(sha256Hash)
                .map(mediaMapper::toResponse)
                .orElse(null);
    }


    @Transactional
    public MediaResponse upload(
            MultipartFile file,
            String sha256Hash
    ) throws IOException {

        validateFile(file);
        validateHash(sha256Hash);

        String calculatedHash =
                calculateSha256(file);

        if (!calculatedHash.equalsIgnoreCase(sha256Hash)) {
            throw new IllegalArgumentException(
                    "Supplied SHA-256 hash does not match the uploaded file"
            );
        }


        Media existingMedia =
                mediaRepository
                        .findBySha256Hash(calculatedHash)
                        .orElse(null);

        if (existingMedia != null) {
            return mediaMapper.toResponse(existingMedia);
        }


        String storageFilename =
                generateStorageFilename(file);

        boolean fileStored = false;

        try {

            mediaStorageService.store(
                    file,
                    storageFilename
            );

            fileStored = true;

            Media media = new Media(
                    file.getOriginalFilename(),
                    determineContentType(file),
                    file.getSize(),
                    calculatedHash,
                    storageFilename
            );

            Media savedMedia =
                    mediaRepository.save(media);

            return mediaMapper.toResponse(savedMedia);

        } catch (Exception e) {

            /*
             * If the physical file was successfully stored but
             * database persistence failed, attempt to clean up
             * the physical file.
             */
            if (fileStored) {
                try {
                    mediaStorageService.delete(
                            storageFilename
                    );
                } catch (Exception cleanupException) {
                    e.addSuppressed(cleanupException);
                }
            }

            throw e;
        }
    }


    @Transactional(readOnly = true)
    public MediaFile getFile(
            Long id
    ) throws IOException {

        Media media =
                getMedia(id);

        String storageFilename =
                media.getStorageFilename();

        if (!mediaStorageService.exists(
                storageFilename
        )) {
            throw new IOException(
                    "Media file does not exist in storage: "
                            + storageFilename
            );
        }

        Path path =
                mediaStorageService.getPath(
                        storageFilename
                );

        return new MediaFile(
                path,
                media.getOriginalFilename(),
                media.getContentType()
        );
    }


    @Transactional(readOnly = true)
    public Media getMedia(
            Long id
    ) {

        return mediaRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Media not found with id: " + id
                        )
                );
    }


    @Transactional(readOnly = true)
    public Path getMediaPath(
            Long id
    ) {

        Media media =
                getMedia(id);

        return mediaStorageService.getPath(
                media.getStorageFilename()
        );
    }


    @Transactional
    public void deleteMedia(
            Long id
    ) throws IOException {

        Media media =
                getMedia(id);

        String storageFilename =
                media.getStorageFilename();

        /*
         * Delete the physical file first.
         *
         * If this fails, the database record remains so that
         * the operation can be retried.
         */
        mediaStorageService.delete(
                storageFilename
        );

        /*
         * The database's ON DELETE RESTRICT constraints are
         * responsible for preventing deletion while the media
         * is still attached to another entity.
         */
        mediaRepository.delete(media);
    }


    private String calculateSha256(
            MultipartFile file
    ) throws IOException {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            try (InputStream inputStream =
                         file.getInputStream()) {

                byte[] buffer =
                        new byte[8192];

                int bytesRead;

                while ((bytesRead =
                        inputStream.read(buffer)) != -1) {

                    digest.update(
                            buffer,
                            0,
                            bytesRead
                    );
                }
            }

            return HexFormat
                    .of()
                    .formatHex(digest.digest());

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    e
            );
        }
    }


    private String determineContentType(
            MultipartFile file
    ) {

        String contentType =
                file.getContentType();

        if (contentType == null ||
                contentType.isBlank()) {

            return "application/octet-stream";
        }

        return contentType;
    }


    private String generateStorageFilename(
            MultipartFile file
    ) {

        String originalFilename =
                file.getOriginalFilename();

        String extension = "";

        if (originalFilename != null) {

            int lastDot =
                    originalFilename.lastIndexOf('.');

            if (lastDot > 0 &&
                    lastDot < originalFilename.length() - 1) {

                extension =
                        originalFilename.substring(lastDot);
            }
        }

        return UUID.randomUUID() + extension;
    }


    private void validateFile(
            MultipartFile file
    ) {

        if (file == null) {
            throw new IllegalArgumentException(
                    "File must not be null"
            );
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException(
                    "File must not be empty"
            );
        }
    }


    private void validateHash(
            String sha256Hash
    ) {

        if (sha256Hash == null ||
                sha256Hash.isBlank()) {

            throw new IllegalArgumentException(
                    "SHA-256 hash must be supplied"
            );
        }

        if (!sha256Hash.matches(
                "^[a-fA-F0-9]{64}$"
        )) {

            throw new IllegalArgumentException(
                    "Invalid SHA-256 hash"
            );
        }
    }

    public record MediaFile(
            Path path,
            String originalFilename,
            String contentType
    ) {
    }
}