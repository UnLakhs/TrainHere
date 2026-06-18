package com.apostolos.backend.config;

import java.util.List;

import com.apostolos.backend.auth.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/locations/pending", "/api/locations/rejected").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/locations/admin/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/photos/pending", "/api/photos/rejected").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/locations/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/locations/{id}/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/photos/{photoId}/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/locations/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/photos/{photoId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/uploads/location-photos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/locations", "/api/locations/bounds", "/api/locations/nearby", "/api/locations/{id}", "/api/locations/{id}/reviews", "/api/locations/{locationId}/photos").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/locations").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/locations/{locationId}/photos").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
