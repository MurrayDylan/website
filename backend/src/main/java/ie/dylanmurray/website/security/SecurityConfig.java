package ie.dylanmurray.website.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import java.util.List;

@EnableMethodSecurity
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(Customizer.withDefaults())

                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .authenticationEntryPoint(
                                        new HttpStatusEntryPoint(
                                                HttpStatus.UNAUTHORIZED
                                        )
                                )
                )

                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.disable())
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        .requestMatchers("/error").permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/projects/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/technologies/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/education/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/work/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/pages/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/media/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/layout-templates/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/settings"
                        ).permitAll()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                .sessionManagement(session -> session
                        .sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        config.setAllowedHeaders(
                List.of("*")
        );

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/api/**",
                config
        );

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }
}