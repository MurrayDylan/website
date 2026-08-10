package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "work_experience")
public class Work {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String companyName;


    @Column(nullable = false)
    private String jobTitle;


    @Column(nullable = false)
    private LocalDate startDate;


    @Column
    private LocalDate endDate;


    @Column(name = "is_current", nullable = false)
    private boolean current;


    @Column
    private String location;


    @Column
    private String companyWebsite;


    @Column
    private String companyLogo;


    @Column(columnDefinition = "TEXT")
    private String description;


    @Column
    private Integer displayOrder;


    @ManyToMany
    @JoinTable(
            name = "work_technologies",
            joinColumns = @JoinColumn(name = "work_id"),
            inverseJoinColumns = @JoinColumn(name = "technology_id")
    )
    private Set<Technology> technologies = new HashSet<>();


    protected Work() {

    }


    public Work(
            String companyName,
            String jobTitle,
            LocalDate startDate,
            LocalDate endDate,
            boolean current,
            String location,
            String companyWebsite,
            String companyLogo,
            String description,
            Integer displayOrder
    ) {
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.startDate = startDate;
        this.endDate = endDate;
        this.current = current;
        this.location = location;
        this.companyWebsite = companyWebsite;
        this.companyLogo = companyLogo;
        this.description = description;
        this.displayOrder = displayOrder;
    }


    public Long getId() {
        return id;
    }


    public String getCompanyName() {
        return companyName;
    }


    public String getJobTitle() {
        return jobTitle;
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


    public String getLocation() {
        return location;
    }


    public String getCompanyWebsite() {
        return companyWebsite;
    }


    public String getCompanyLogo() {
        return companyLogo;
    }


    public String getDescription() {
        return description;
    }


    public Integer getDisplayOrder() {
        return displayOrder;
    }


    public Set<Technology> getTechnologies() {
        return technologies;
    }


    public void addTechnology(Technology technology) {

        technologies.add(technology);
        technology.getWorkExperience().add(this);

    }


    public void update(
            String companyName,
            String jobTitle,
            LocalDate startDate,
            LocalDate endDate,
            boolean current,
            String location,
            String companyWebsite,
            String companyLogo,
            String description,
            Integer displayOrder
    ) {
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.startDate = startDate;
        this.endDate = endDate;
        this.current = current;
        this.location = location;
        this.companyWebsite = companyWebsite;
        this.companyLogo = companyLogo;
        this.description = description;
        this.displayOrder = displayOrder;
    }


    public void replaceTechnologies(Set<Technology> technologies) {

        for (Technology tech : new HashSet<>(this.technologies)) {
            tech.getWorkExperience().remove(this);
        }

        this.technologies.clear();

        for (Technology tech : technologies) {
            this.technologies.add(tech);
            tech.getWorkExperience().add(this);
        }
    }
}