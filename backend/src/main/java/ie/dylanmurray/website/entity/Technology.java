package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "technologies")
public class Technology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            unique = true,
            length = 50
    )
    private String name;

    @Column(
            nullable = false,
            length = 100
    )
    private String category;

    @ManyToMany(mappedBy = "technologies")
    private Set<Project> projects = new HashSet<>();

    @ManyToMany(mappedBy = "technologies")
    private Set<Work> workExperience = new HashSet<>();

    protected Technology() {
    }

    public Technology(
            String name,
            String category
    ) {
        this.name = name;
        this.category = category;
    }

    /*
     * Kept for compatibility with the existing
     * project technology creation behaviour.
     */
    public Technology(String name) {
        this.name = name;
        this.category = "Other";
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public Set<Project> getProjects() {
        return projects;
    }

    public Set<Work> getWorkExperience() {
        return workExperience;
    }

    public void update(
            String name,
            String category
    ) {
        this.name = name;
        this.category = category;
    }
}