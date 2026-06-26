package com.bok.auth.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bok.auth.entity.User;
import com.bok.auth.repository.UserRepository;
import com.bok.auth.exception.UserNotFoundException;
import com.bok.auth.dto.LoginRequest;
import com.bok.auth.dto.RegisterRequest;
import com.bok.auth.exception.InvalidCredentialsException;

import jakarta.transaction.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    
    public User login(LoginRequest loginRequest) {
        return userRepository.findByEmailAndPasswordHash(loginRequest.getEmail(), loginRequest.getPasswordHash()).orElseThrow(() -> new UserNotFoundException());
    }

    @Transactional
    public User register(RegisterRequest user) {
        User newUser = new User();
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setEmail(user.getEmail());
        newUser.setPhoneNumber(user.getPhoneNumber());
        newUser.setPasswordHash(user.getPasswordHash());
        return userRepository.save(newUser);
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException());
    }

    public List<User> listUsers() {
        return userRepository.findAll();
    }
}
