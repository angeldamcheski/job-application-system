package com.example.jobapplicationservice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http.csrf(AbstractHttpConfigurer::disable).cors(cors->{}).authorizeHttpRequests(auth->auth
//                .requestMatchers("/api/auth/**")
//                .permitAll().requestMatchers("/api/jobposts/create").hasRole("ADMIN").anyRequest().authenticated());
//        return http.build();
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {
                })
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobposts").permitAll()
                        .requestMatchers("/api/cv/**").hasAnyRole("APPLICANT", "ADMIN")
                        .requestMatchers("/api/bookmarks/**").permitAll()
//                        .requestMatchers(HttpMethod.DELETE,"/api/bookmarks/delete/**").hasAnyRole("APPLICANT", "ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/cv/download/**").hasAnyRole("APPLICANT", "ADMIN")
                        .requestMatchers("/api/applicants/").hasAnyRole("APPLICANT", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/applications/filter/**").hasRole("ADMIN")
                        .requestMatchers("/api/applications/applicant/**").hasRole("APPLICANT")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/jobposts/create").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173"); // frontend origin
        configuration.addAllowedMethod("*"); // GET, POST, PATCH, DELETE
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
