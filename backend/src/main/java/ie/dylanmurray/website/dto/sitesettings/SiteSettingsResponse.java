package ie.dylanmurray.website.dto.sitesettings;

public class SiteSettingsResponse {
    private String email;
    private String githubUrl;
    private String linkedinUrl;
    private String socialOne;
    private String socialTwo;
    private String socialThree;

    public SiteSettingsResponse() {}

    public SiteSettingsResponse(String email, String githubUrl, String linkedinUrl, String socialOne, String socialTwo, String socialThree) {
        this.email = email;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.socialOne = socialOne;
        this.socialTwo = socialTwo;
        this.socialThree = socialThree;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getSocialOne() { return socialOne; }
    public void setSocialOne(String socialOne) { this.socialOne = socialOne; }
    public String getSocialTwo() { return socialTwo; }
    public void setSocialTwo(String socialTwo) { this.socialTwo = socialTwo; }
    public String getSocialThree() { return socialThree; }
    public void setSocialThree(String socialThree) { this.socialThree = socialThree; }
}