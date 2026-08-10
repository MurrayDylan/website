package ie.dylanmurray.website.repository;

import ie.dylanmurray.website.entity.Work;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface WorkRepository extends JpaRepository<Work, Long> {


    @Query("""
        SELECT w
        FROM Work w
        ORDER BY 
            CASE WHEN w.displayOrder IS NULL THEN 1 ELSE 0 END,
            w.displayOrder ASC,
            w.startDate DESC
    """)
    List<Work> findAllOrdered();

}