package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface EducationRepository
        extends JpaRepository<Education, Long> {


    List<Education> findAllByOrderByDisplayOrderAsc();

}