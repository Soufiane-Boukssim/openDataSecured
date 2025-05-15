package com.soufiane.open_data.services;

import com.soufiane.open_data.models.MyUserDetails;
import com.soufiane.open_data.entities.User;
import com.soufiane.open_data.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user= userRepo.findFirstByEmail(email);
        if(user==null){
            throw new UsernameNotFoundException(email);
        }
        return new MyUserDetails(user);
    }

}