package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.ModuleTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ModuleTopicRepository
        extends JpaRepository<ModuleTopic, Long> {


    List<ModuleTopic> findByModuleIdOrderByDisplayOrderAsc(
            Long moduleId
    );

}