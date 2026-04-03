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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        ReflectionTestUtils.setField(registerRequest, "username", "testuser");
        ReflectionTestUtils.setField(registerRequest, "email", "test@test.com");
        ReflectionTestUtils.setField(registerRequest, "password", "password123");

        loginRequest = new LoginRequest();
        ReflectionTestUtils.setField(loginRequest, "username", "testuser");
        ReflectionTestUtils.setField(loginRequest, "password", "password123");

        testUser = new User("testuser", "test@test.com", "encodedPassword");
    }

    @Test
    void register_withValidCredentials_returnsToken() {
        
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtProvider.generateToken(anyString(), anyString())).thenReturn("mockToken");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("User registered and authenticated successfully", response.getMessage());
        
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtProvider, times(1)).generateToken("testuser", "test@test.com");
    }

    @Test
    void register_withExistingEmail_throwsException() {
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_withExistingUsername_throwsException() {
        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThrows(UsernameAlreadyExistsException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_withValidUsername_returnsToken() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtProvider.generateToken("testuser", "test@test.com")).thenReturn("mockToken");
        AuthResponse response = authService.login(loginRequest);
        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    void login_withValidEmail_returnsToken() {
        LoginRequest emailLoginRequest = new LoginRequest();
        ReflectionTestUtils.setField(emailLoginRequest, "username", "test@test.com");
        ReflectionTestUtils.setField(emailLoginRequest, "password", "password123");

        when(userRepository.findByUsername("test@test.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtProvider.generateToken("testuser", "test@test.com")).thenReturn("mockToken");

        AuthResponse response = authService.login(emailLoginRequest);

        assertNotNull(response);
        assertEquals("mockToken", response.getToken());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    void login_withInvalidUsername_throwsException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("testuser")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(loginRequest));
    }

    @Test
    void login_withInvalidPassword_throwsException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(loginRequest));
    }
}
