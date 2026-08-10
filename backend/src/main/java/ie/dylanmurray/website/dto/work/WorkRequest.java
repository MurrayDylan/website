package ie.dylanmurray.website.dto.work;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;


public record WorkRequest(

        @NotBlank
        String companyName,

        @NotBlank
        String jobTitle,

        @NotNull
        LocalDate startDate,

        LocalDate endDate,

        boolean current,

        String location,

        String companyWebsite,

        String companyLogo,

        String description,

        Integer displayOrder,

        Set<Long> technologyIds

) {
}