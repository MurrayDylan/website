package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.LayoutTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LayoutTemplateRepository extends JpaRepository<LayoutTemplate, String> {
}