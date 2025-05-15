package com.soufiane.open_data.controllers;

import com.soufiane.open_data.dtos.user.UserLoginRequest;
import com.soufiane.open_data.dtos.user.UserLoginResponse;
import com.soufiane.open_data.dtos.user.UserRegisterRequest;
import com.soufiane.open_data.dtos.user.UserRegisterResponse;
import com.soufiane.open_data.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public UserRegisterResponse addUser(@RequestBody UserRegisterRequest user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public UserLoginResponse login(@RequestBody UserLoginRequest user) {
        return userService.verify(user);
    }

}