package com.soufiane.open_data.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class TestController {


    @GetMapping("/students")
    public String getAllStudents() {
        return "general";
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/students2")
    public String getAllStudents2() {
        return "USER";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/students3")
    public String getAllStudents3() {
        return "ADMIN";
    }

    @PreAuthorize("hasRole('PROVIDER')")
    @GetMapping("/students4")
    public String getAllStudents4() {
        return "PROVIDER";
    }

}
