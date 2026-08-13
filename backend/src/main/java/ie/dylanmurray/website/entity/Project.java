package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
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

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProjectLink> links = new ArrayList<>();

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC")
    private List<ProjectMedia> media = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

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
            String description
    ) {
        this.title = title;
        this.description = description;
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

    public List<ProjectLink> getLinks() {
        return links;
    }

    public List<ProjectMedia> getMedia() {
        return media;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Set<Technology> getTechnologies() {
        return technologies;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void addLink(ProjectLink link) {
        links.add(link);
        link.setProject(this);
    }

    public void removeLink(ProjectLink link) {
        links.remove(link);
        link.setProject(null);
    }

    public void addMedia(ProjectMedia projectMedia) {
        media.add(projectMedia);
        projectMedia.setProject(this);
    }

    public void removeMedia(ProjectMedia projectMedia) {
        media.remove(projectMedia);
        projectMedia.setProject(null);
    }

    public void addTechnology(Technology technology) {
        technologies.add(technology);
        technology.getProjects().add(this);
    }

    public void update(
            String title,
            String description,
            Integer displayOrder
    ) {
        this.title = title;
        this.description = description;
        this.displayOrder = displayOrder;
    }

    public void replaceTechnologies(
            Set<Technology> technologies
    ) {
        for (Technology tech : new HashSet<>(this.technologies)) {
            tech.getProjects().remove(this);
        }

        this.technologies.clear();

        for (Technology tech : technologies) {
            this.technologies.add(tech);
            tech.getProjects().add(this);
        }
    }
}