package ie.dylanmurray.website.dto.education;

import java.time.LocalDate;
import java.util.List;


public class EducationResponse {

    private Long id;

    private String institution;

    private String qualification;

    private String fieldOfStudy;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean current;

    private String grade;

    private String description;

    private Integer displayOrder;

    private List<ModuleResponse> modules;


    public EducationResponse(
            Long id,
            String institution,
            String qualification,
            String fieldOfStudy,
            LocalDate startDate,
            LocalDate endDate,
            boolean current,
            String grade,
            String description,
            Integer displayOrder,
            List<ModuleResponse> modules
    ) {
        this.id = id;
        this.institution = institution;
        this.qualification = qualification;
        this.fieldOfStudy = fieldOfStudy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.current = current;
        this.grade = grade;
        this.description = description;
        this.displayOrder = displayOrder;
        this.modules = modules;
    }


    public Long getId() {
        return id;
    }

    public String getInstitution() {
        return institution;
    }

    public String getQualification() {
        return qualification;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public boolean isCurrent() {
        return current;
    }

    public String getGrade() {
        return grade;
    }

    public String getDescription() {
        return description;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public List<ModuleResponse> getModules() {
        return modules;
    }
}