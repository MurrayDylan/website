package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "media",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_media_file_hash",
                        columnNames = "file_hash"
                ),
                @UniqueConstraint(
                        name = "uk_media_stored_filename",
                        columnNames = "stored_filename"
                ),
                @UniqueConstraint(
                        name = "uk_media_storage_key",
                        columnNames = "storage_key"
                )
        }
)
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_hash", nullable = false, length = 64)
    private String fileHash;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "stored_filename", nullable = false)
    private String storedFilename;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "storage_key", nullable = false)
    private String storageKey;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Media() {
    }

    public Media(
            String fileHash,
            String originalFilename,
            String storedFilename,
            String mimeType,
            Long fileSize,
            String storageKey
    ) {
        this.fileHash = fileHash;
        this.originalFilename = originalFilename;
        this.storedFilename = storedFilename;
        this.mimeType = mimeType;
        this.fileSize = fileSize;
        this.storageKey = storageKey;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getFileHash() {
        return fileHash;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getStoredFilename() {
        return storedFilename;
    }

    public String getMimeType() {
        return mimeType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public String getStorageKey() {
        return storageKey;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}