package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.ProjectMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMediaRepository
        extends JpaRepository<ProjectMedia, Long> {

    List<ProjectMedia> findByProjectIdOrderByDisplayOrderAsc(Long projectId);

    Optional<ProjectMedia> findByProjectIdAndMediaId(
            Long projectId,
            Long mediaId
    );

    boolean existsByProjectIdAndMediaId(
            Long projectId,
            Long mediaId
    );

    boolean existsByMediaId(Long mediaId);
}