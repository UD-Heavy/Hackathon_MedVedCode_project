package ru.secureOps.medVedCode.medVedCode.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import ru.secureOps.medVedCode.medVedCode.security.PersonDetails;

@Controller
@RequestMapping("/")
public class MainController {

    @GetMapping
    public String getHubPage(Model model){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PersonDetails personDetails = (PersonDetails) authentication.getPrincipal();
        model.addAttribute("username", personDetails.getUsername());
        return "index";
    }
    @GetMapping("/info")
    public String getInfo()
    {
        return "info";
    }
    @GetMapping("/calendar")
    public String getCalendar()
    {
        return "calendar";
    }
    @GetMapping("/pacient")
    public String getPacient()
    {
        return "pacient";
    }
    
}

