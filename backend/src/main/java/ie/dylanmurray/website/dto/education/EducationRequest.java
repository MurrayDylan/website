package ie.dylanmurray.website.dto.education;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public class EducationRequest {

    @NotBlank(message = "Institution cannot be empty")
    @Size(max = 200, message = "Institution cannot exceed 200 characters")
    private String institution;

    @NotBlank(message = "Qualification cannot be empty")
    @Size(max = 200, message = "Qualification cannot exceed 200 characters")
    private String qualification;

    @NotBlank(message = "Location cannot be empty")
    @Size(max = 200, message = "Location cannot exceed 200 characters")
    private String location;

    private String fieldOfStudy;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean current;
    private String grade;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    private Integer displayOrder;

    private List<@Valid ModuleRequest> modules;

    // Getters
    public String getInstitution() {
        return institution;
    }

    public String getLocation() {
        return location;
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

    public List<ModuleRequest> getModules() {
        return modules;
    }

    // Setters
    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void setModules(List<ModuleRequest> modules) {
        this.modules = modules;
    }
}