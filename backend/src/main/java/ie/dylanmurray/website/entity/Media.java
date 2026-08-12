package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "media",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_media_sha256_hash",
                        columnNames = "sha256_hash"
                )
        }
)
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalFilename;

    @Column(nullable = false, length = 100)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(name = "sha256_hash", nullable = false, length = 64)
    private String sha256Hash;

    @Column(nullable = false)
    private String storageFilename;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected Media() {
    }

    public Media(
            String originalFilename,
            String contentType,
            Long fileSize,
            String sha256Hash,
            String storageFilename
    ) {
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.sha256Hash = sha256Hash;
        this.storageFilename = storageFilename;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public String getSha256Hash() {
        return sha256Hash;
    }

    public String getStorageFilename() {
        return storageFilename;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}