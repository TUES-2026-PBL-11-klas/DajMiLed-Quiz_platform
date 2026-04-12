package com.formus.server.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.formus.server.exceptions.InvalidJwtException;

import io.jsonwebtoken.JwtException;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${expiration.ms}")
    private long expirationMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username, Long id) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("id", id)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        if (token == null || token.isBlank()) {
            throw new InvalidJwtException("JWT token is missing");
        }

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException ex) {
            throw new InvalidJwtException("Invalid JWT token", ex);
        }
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (InvalidJwtException ex) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return parseToken(token).getSubject();
    }

    public Long getIdFromToken(String token) {
        return parseToken(token).get("id", Long.class);
    }

    public String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new InvalidJwtException("Missing or invalid Authorization header");
        }
        return authorizationHeader.substring(7);
    }
}
