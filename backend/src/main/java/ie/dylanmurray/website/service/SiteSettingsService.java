package ie.dylanmurray.website.service;

import ie.dylanmurray.website.dto.sitesettings.SiteSettingsRequest;
import ie.dylanmurray.website.dto.sitesettings.SiteSettingsResponse;
import ie.dylanmurray.website.entity.SiteSettings;
import ie.dylanmurray.website.repository.SiteSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SiteSettingsService {

    private final SiteSettingsRepository repository;

    public SiteSettingsService(SiteSettingsRepository repository) {
        this.repository = repository;
    }

    public SiteSettingsResponse getSettings() {
        SiteSettings settings = repository.findById(1L).orElseGet(() -> {
            SiteSettings empty = new SiteSettings();
            empty.setId(1L);
            return repository.save(empty);
        });
        return mapToResponse(settings);
    }

    public SiteSettingsResponse updateSettings(SiteSettingsRequest request) {
        SiteSettings settings = repository.findById(1L).orElse(new SiteSettings());
        settings.setId(1L);
        settings.setEmail(request.getEmail());
        settings.setGithubUrl(request.getGithubUrl());
        settings.setLinkedinUrl(request.getLinkedinUrl());
        settings.setSocialOne(request.getSocialOne());
        settings.setSocialTwo(request.getSocialTwo());
        settings.setSocialThree(request.getSocialThree());

        SiteSettings saved = repository.save(settings);
        return mapToResponse(saved);
    }

    private SiteSettingsResponse mapToResponse(SiteSettings entity) {
        return new SiteSettingsResponse(
                entity.getEmail(),
                entity.getGithubUrl(),
                entity.getLinkedinUrl(),
                entity.getSocialOne(),
                entity.getSocialTwo(),
                entity.getSocialThree()
        );
    }
}