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


    @Column(nullable = false, unique = true)
    private String name;


    @ManyToMany(mappedBy = "technologies")
    private Set<Project> projects = new HashSet<>();


    protected Technology(){

    }


    public Technology(String name){
        this.name = name;
    }


    public Long getId(){
        return id;
    }


    public String getName(){
        return name;
    }


    public Set<Project> getProjects(){
        return projects;
    }
}