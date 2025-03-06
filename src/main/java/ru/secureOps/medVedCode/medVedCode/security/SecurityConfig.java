package ru.secureOps.medVedCode.medVedCode.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(request -> request
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/").hasAnyRole("ADMIN", "DOCTOR", "NURSE")
                        .requestMatchers("/info", "/login", "/error").permitAll()
                        .anyRequest().hasAnyRole("ADMIN", "DOCTOR", "NURSE"))
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/")
                        .loginProcessingUrl("/perform-login")
                        .failureForwardUrl("/login?error")
                )
                .oneTimeTokenLogin(Customizer.withDefaults())
                .logout(form -> form
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/info"))
                .build();
    }
}
