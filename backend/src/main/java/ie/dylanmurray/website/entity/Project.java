package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "projects")
public class Project {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String title;


    @Column(columnDefinition = "TEXT")
    private String description;


    @Column(name = "project_url")
    private String projectUrl;


    @Column(name = "created_at")
    private LocalDateTime createdAt;


    @ManyToMany
    @JoinTable(
            name = "project_technologies",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "technology_id")
    )
    private Set<Technology> technologies = new HashSet<>();


    protected Project() {

    }


    public Project(
            String title,
            String description,
            String projectUrl
    ) {
        this.title = title;
        this.description = description;
        this.projectUrl = projectUrl;
        this.createdAt = LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }


    public String getTitle() {
        return title;
    }


    public String getDescription() {
        return description;
    }


    public String getProjectUrl() {
        return projectUrl;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public Set<Technology> getTechnologies() {
        return technologies;
    }


    public void addTechnology(Technology technology) {
        technologies.add(technology);
    }
}