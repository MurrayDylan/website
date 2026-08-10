package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ModuleRepository
        extends JpaRepository<Module, Long> {


    List<Module> findByEducationIdOrderByDisplayOrderAsc(
            Long educationId
    );

}