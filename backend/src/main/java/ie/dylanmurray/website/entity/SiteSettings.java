package ie.dylanmurray.website.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "site_settings")
public class SiteSettings {

    @Id
    private Long id = 1L; // Enforces singleton row pattern

    private String email;
    private String githubUrl;
    private String linkedinUrl;
    private String socialOne;
    private String socialTwo;
    private String socialThree;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getSocialOne() {
        return socialOne;
    }

    public void setSocialOne(String socialOne) {
        this.socialOne = socialOne;
    }

    public String getSocialTwo() {
        return socialTwo;
    }

    public void setSocialTwo(String socialTwo) {
        this.socialTwo = socialTwo;
    }

    public String getSocialThree() {
        return socialThree;
    }

    public void setSocialThree(String socialThree) {
        this.socialThree = socialThree;
    }
}