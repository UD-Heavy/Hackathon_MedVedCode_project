package ru.secureOps.medVedCode.medVedCode.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.secureOps.medVedCode.medVedCode.repositories.PersonRepository;
import ru.secureOps.medVedCode.medVedCode.services.PersonDetailsService;

@Configuration
public class GlobalConfig {

    @Bean
    public PersonDetailsService personDetailsService(PersonRepository personRepository) {
        return new PersonDetailsService(personRepository);
    }
}
