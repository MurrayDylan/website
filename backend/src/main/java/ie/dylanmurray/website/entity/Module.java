package ie.dylanmurray.website.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "modules")
public class Module {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    private String grade;


    @Column(columnDefinition = "TEXT")
    private String description;


    @Column(name = "display_order")
    private Integer displayOrder;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "education_id", nullable = false)
    private Education education;



    @OneToMany(
            mappedBy = "module",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ModuleTopic> topics = new ArrayList<>();



    protected Module() {

    }


    public Module(
            String name,
            String grade,
            String description,
            Integer displayOrder
    ) {
        this.name = name;
        this.grade = grade;
        this.description = description;
        this.displayOrder = displayOrder;
    }



    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
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


    public Education getEducation() {
        return education;
    }


    public List<ModuleTopic> getTopics() {
        return topics;
    }


    protected void setEducation(Education education) {

        this.education = education;

    }


    public void addTopic(ModuleTopic topic) {

        topics.add(topic);
        topic.setModule(this);

    }


    public void update(
            String name,
            String grade,
            String description,
            Integer displayOrder
    ) {

        this.name = name;
        this.grade = grade;
        this.description = description;
        this.displayOrder = displayOrder;

    }

}