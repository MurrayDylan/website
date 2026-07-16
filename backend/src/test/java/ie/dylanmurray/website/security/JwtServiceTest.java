package ie.dylanmurray.website.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    private final String secret =
            "my-super-secret-key-that-is-at-least-32-characters-long";

    @BeforeEach
    void setup() {

        jwtService = new JwtService(
                secret,
                1000 * 60 * 60 // 1 hour
        );

    }


    @Test
    void shouldGenerateToken() {

        String token = jwtService.generateToken("admin");


        assertNotNull(token);
        assertFalse(token.isEmpty());

    }



    @Test
    void shouldExtractUsernameFromToken() {

        String token = jwtService.generateToken("admin");


        String username =
                jwtService.extractUsername(token);


        assertEquals("admin", username);

    }



    @Test
    void shouldValidateCorrectToken() {

        String username = "admin";

        String token =
                jwtService.generateToken(username);


        UserDetails userDetails =
                User.builder()
                        .username(username)
                        .password("password")
                        .roles("ADMIN")
                        .build();


        assertTrue(
                jwtService.isTokenValid(
                        token,
                        userDetails
                )
        );

    }



    @Test
    void shouldRejectTokenForDifferentUser() {

        String token =
                jwtService.generateToken("admin");


        UserDetails userDetails =
                User.builder()
                        .username("wrong-user")
                        .password("password")
                        .roles("ADMIN")
                        .build();


        assertFalse(
                jwtService.isTokenValid(
                        token,
                        userDetails
                )
        );

    }

}