package ie.dylanmurray.website.controller;

import ie.dylanmurray.website.dto.login.LoginRequest;
import ie.dylanmurray.website.dto.login.LoginResponse;
import ie.dylanmurray.website.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(
            AuthenticationService authenticationService
    ) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request
    ) {

        return authenticationService.login(request);

    }

    @GetMapping("/debug")
    public Object debug(Authentication authentication) {
        return authentication;
    }

}