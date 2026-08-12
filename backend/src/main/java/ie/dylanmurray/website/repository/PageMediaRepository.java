package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.PageMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PageMediaRepository
        extends JpaRepository<PageMedia, Long> {

    List<PageMedia> findByPageIdOrderByDisplayOrderAsc(Long pageId);

    Optional<PageMedia> findByPageIdAndMediaId(
            Long pageId,
            Long mediaId
    );

    boolean existsByPageIdAndMediaId(
            Long pageId,
            Long mediaId
    );

    boolean existsByMediaId(Long mediaId);
}