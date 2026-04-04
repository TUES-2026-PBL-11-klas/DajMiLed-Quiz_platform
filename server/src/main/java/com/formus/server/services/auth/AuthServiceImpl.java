package com.formus.server.services.auth;

import com.formus.server.dtos.AuthResponse;
import com.formus.server.dtos.LoginRequest;
import com.formus.server.dtos.RegisterRequest;
import com.formus.server.exceptions.EmailAlreadyExistsException;
import com.formus.server.exceptions.InvalidCredentialsException;
import com.formus.server.exceptions.UsernameAlreadyExistsException;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.User;
import com.formus.server.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException(request.getUsername());
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(request.getUsername(), request.getEmail(), encodedPassword);
        userRepository.save(user);

        String token = jwtProvider.generateToken(user.getUsername(), user.getId());
        return new AuthResponse(token, "User registered and authenticated successfully");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseGet(() -> userRepository.findByEmail(request.getUsername()).orElse(null));

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtProvider.generateToken(user.getUsername(), user.getId());
        return new AuthResponse(token, "Login successful");
    }
}
