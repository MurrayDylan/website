package ie.dylanmurray.website.config;

import ie.dylanmurray.website.repository.UserRepository;
import ie.dylanmurray.website.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class DataInitialiser {

    private final String username;
    private final String password;

    public DataInitialiser(
            @Value("${admin.username}") String username,
            @Value("${admin.password}") String password
    ) {
        this.username = username;
        this.password = password;
    }


    @Bean
    CommandLineRunner initialiseDatabase(
            UserRepository userRepository,
            UserService userService
    ) {

        return args -> {
            if(userRepository.findByUsername(username).isEmpty()) {
                userService.createAdmin(
                        username,
                        password
                );
            }
        };
    }
}