package com.soufiane.open_data.mappers;

import com.soufiane.open_data.dtos.user.UserLoginRequest;
import com.soufiane.open_data.dtos.user.UserRegisterRequest;
import com.soufiane.open_data.dtos.user.UserRegisterResponse;
import com.soufiane.open_data.entities.User;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class UserMapper {

    private final ModelMapper modelMapper;

    public User registerRequestConvertToEntity(UserRegisterRequest userRegisterRequest) {
        return modelMapper.map(userRegisterRequest, User.class);
    }

    public User loginRequestConvertToEntity(UserLoginRequest userLoginRequest) {
        return modelMapper.map(userLoginRequest, User.class);
    }

    public UserRegisterResponse userConvertToResponse(User user) {
        return modelMapper.map(user, UserRegisterResponse.class);
    }

}