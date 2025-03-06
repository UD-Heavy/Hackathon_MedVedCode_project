package ru.secureOps.medVedCode.medVedCode.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;


/**
 * Конфигурация безопасности приложения.
 * Класс определяет правила доступа для различных ролей пользователей настройки аутентификации и выхода из системы.
 */
@EnableWebSecurity
public class SecurityConfig {

    /**
     * <pre>
     * Настройка цепочки фильтров безопасности.
     * Определение, каким ролям открыт доступ к каким URL
     Доступность маршрутов определяется следующим образом:
     *
     * 1. `/admin/**`
     *    Доступно для: Роль `ADMIN`
     *    Описание: Все URL, начинающиеся с `/admin/`, могут быть доступны только пользователям с ролью `ADMIN`
     *
     * 2. Маршрут `/` (главная страница)
     *    Доступно для: Роли `ADMIN`, `DOCTOR`, `NURSE`
     *    Описание: Главная страница доступна для пользователей, входящих в любую из указанных ролей
     *
     * 3. Маршруты `/info`, `/login`, `/error`
     *    Доступно для: Всем (без аутентификации)
     *    Описание: Эти страницы открыты для всех пользователей и не требуют входа в систему
     *
     * 4.*Все другие маршруты (`anyRequest()`)
     *    Доступно для: Роли `ADMIN`, `DOCTOR`, `NURSE`
     *    Описание: Все остальные маршруты
     * <pre/>
     * @param http объект с параметрами безопасности HTTP
     * @return цепочка фильтров
     * @throws Exception в случае ошибки при настройке безопасности
     */
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
