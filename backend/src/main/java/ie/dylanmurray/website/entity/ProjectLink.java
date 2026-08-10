package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "project_links")
public class ProjectLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    public ProjectLink() {
    }

    public ProjectLink(String label, String url) {
        this.label = label;
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public String getLabel() {
        return label;
    }

    public String getUrl() {
        return url;
    }

    public Project getProject() {
        return project;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setProject(Project project) {
        this.project = project;
    }

}
