package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.Technology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface TechnologyRepository
        extends JpaRepository<Technology, Long> {


    Optional<Technology> findByName(String name);

}