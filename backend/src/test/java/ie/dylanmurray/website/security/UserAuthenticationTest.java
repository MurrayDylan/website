package ie.dylanmurray.website.security;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import static org.junit.jupiter.api.Assertions.assertEquals;


@SpringBootTest
class UserAuthenticationTest {


    @Autowired
    private UserDetailsService userDetailsService;


    @Test
    void loadsAdminUser() {


        UserDetails user =
                userDetailsService.loadUserByUsername("dylan");


        assertEquals(
                "dylan",
                user.getUsername()
        );
    }
}