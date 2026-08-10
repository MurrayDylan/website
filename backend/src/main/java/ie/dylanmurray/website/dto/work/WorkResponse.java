package ie.dylanmurray.website.dto.work;

import ie.dylanmurray.website.dto.technology.TechnologyResponse;

import java.time.LocalDate;
import java.util.Set;


public record WorkResponse(

        Long id,

        String companyName,

        String jobTitle,

        LocalDate startDate,

        LocalDate endDate,

        boolean current,

        String location,

        String companyWebsite,

        String companyLogo,

        String description,

        Integer displayOrder,

        Set<TechnologyResponse> technologies

) {
}