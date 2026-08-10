package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "education")
public class Education {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String institution;


    @Column(nullable = false)
    private String qualification;


    @Column(name = "field_of_study")
    private String fieldOfStudy;


    @Column(name = "start_date")
    private LocalDate startDate;


    @Column(name = "end_date")
    private LocalDate endDate;


    @Column(nullable = false)
    private boolean current;


    private String grade;


    @Column(columnDefinition = "TEXT")
    private String description;


    @Column(name = "display_order")
    private Integer displayOrder;



    @OneToMany(
            mappedBy = "education",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Module> modules = new ArrayList<>();


    protected Education() {

    }


    public Education(
            String institution,
            String qualification,
            String fieldOfStudy,
            LocalDate startDate,
            LocalDate endDate,
            boolean current,
            String grade,
            String description,
            Integer displayOrder
    ) {
        this.institution = institution;
        this.qualification = qualification;
        this.fieldOfStudy = fieldOfStudy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.current = current;
        this.grade = grade;
        this.description = description;
        this.displayOrder = displayOrder;
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


    public List<Module> getModules() {
        return modules;
    }


    public void addModule(Module module) {

        modules.add(module);
        module.setEducation(this);

    }


    public void update(
            String institution,
            String qualification,
            String fieldOfStudy,
            LocalDate startDate,
            LocalDate endDate,
            boolean current,
            String grade,
            String description,
            Integer displayOrder
    ) {

        this.institution = institution;
        this.qualification = qualification;
        this.fieldOfStudy = fieldOfStudy;
        this.startDate = startDate;
        this.endDate = endDate;
        this.current = current;
        this.grade = grade;
        this.description = description;
        this.displayOrder = displayOrder;

    }

}