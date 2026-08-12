package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {

    Optional<Media> findBySha256Hash(String sha256Hash);

    boolean existsBySha256Hash(String sha256Hash);
}