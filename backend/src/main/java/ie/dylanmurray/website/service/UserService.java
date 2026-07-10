package ie.dylanmurray.website.service;

import ie.dylanmurray.website.entity.Role;
import ie.dylanmurray.website.entity.User;
import ie.dylanmurray.website.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createAdmin(
            String username,
            String password
    ) {

        String hashedPassword = passwordEncoder.encode(password);

        User user = new User(
                username,
                hashedPassword,
                Role.ADMIN
        );

        return userRepository.save(user);
    }

}