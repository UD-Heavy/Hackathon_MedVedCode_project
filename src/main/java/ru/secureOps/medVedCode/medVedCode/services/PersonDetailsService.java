package ru.secureOps.medVedCode.medVedCode.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ru.secureOps.medVedCode.medVedCode.models.Person;
import ru.secureOps.medVedCode.medVedCode.repositories.PersonRepository;
import ru.secureOps.medVedCode.medVedCode.security.PersonDetails;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonDetailsService implements UserDetailsService {

    private final PersonRepository personRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<Person> person = personRepository.findByUsername(username);

        return person.map(PersonDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }
}
