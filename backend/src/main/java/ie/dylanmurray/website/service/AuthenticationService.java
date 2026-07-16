package ie.dylanmurray.website.service;


import ie.dylanmurray.website.dto.login.LoginRequest;
import ie.dylanmurray.website.dto.login.LoginResponse;
import ie.dylanmurray.website.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;


@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public AuthenticationService(
        AuthenticationManager authenticationManager,
        JwtService jwtService
    ) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }



    public LoginResponse login(LoginRequest request) {


        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );


        String token =
                jwtService.generateToken(
                        request.getUsername()
                );


        return new LoginResponse(token);
    }

}