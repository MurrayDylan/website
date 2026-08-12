package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.WorkMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkMediaRepository
        extends JpaRepository<WorkMedia, Long> {

    List<WorkMedia> findByWorkIdOrderByDisplayOrderAsc(Long workId);

    Optional<WorkMedia> findByWorkIdAndMediaId(
            Long workId,
            Long mediaId
    );

    boolean existsByWorkIdAndMediaId(
            Long workId,
            Long mediaId
    );

    boolean existsByMediaId(Long mediaId);
}