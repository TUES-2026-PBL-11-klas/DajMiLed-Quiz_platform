package com.formus.server.services.auth;

import com.formus.server.dtos.AuthResponse;
import com.formus.server.dtos.LoginRequest;
import com.formus.server.dtos.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
