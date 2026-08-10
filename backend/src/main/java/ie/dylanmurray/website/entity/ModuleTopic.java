package ie.dylanmurray.website.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "module_topics")
public class ModuleTopic {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String title;


    @Column(name = "display_order")
    private Integer displayOrder;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;



    protected ModuleTopic() {

    }


    public ModuleTopic(
            String title,
            Integer displayOrder
    ) {

        this.title = title;
        this.displayOrder = displayOrder;

    }



    public Long getId() {
        return id;
    }


    public String getTitle() {
        return title;
    }


    public Integer getDisplayOrder() {
        return displayOrder;
    }


    public Module getModule() {
        return module;
    }


    protected void setModule(Module module) {

        this.module = module;

    }


    public void update(
            String title,
            Integer displayOrder
    ) {

        this.title = title;
        this.displayOrder = displayOrder;

    }

}