package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProjectRepository
        extends JpaRepository<Project, Long> {


}