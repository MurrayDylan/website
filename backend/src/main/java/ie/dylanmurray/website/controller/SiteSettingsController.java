package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.sitesettings.SiteSettingsRequest;
import ie.dylanmurray.website.dto.sitesettings.SiteSettingsResponse;
import ie.dylanmurray.website.service.SiteSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SiteSettingsController {

    private final SiteSettingsService service;

    public SiteSettingsController(SiteSettingsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<SiteSettingsResponse> getSettings() {
        return ResponseEntity.ok(service.getSettings());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public ResponseEntity<SiteSettingsResponse> updateSettings(@RequestBody SiteSettingsRequest request) {
        return ResponseEntity.ok(service.updateSettings(request));
    }
}