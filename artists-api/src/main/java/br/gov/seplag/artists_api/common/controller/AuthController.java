package br.gov.seplag.artists_api.common.controller;

import br.gov.seplag.artists_api.common.dto.AuthResponse;
import br.gov.seplag.artists_api.common.dto.LoginRequest;
import br.gov.seplag.artists_api.common.dto.RefreshTokenRequest;
import br.gov.seplag.artists_api.common.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para autenticação JWT.
 * - Login: POST /api/v1/auth/login
 * - Renovação: POST /api/v1/auth/refresh
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${jwt.expiration:300000}")
    private long jwtExpiration;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtService.generateToken(authentication.getName());
        
        return ResponseEntity.ok(new AuthResponse(token, jwtExpiration, authentication.getName()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        String username = jwtService.extractUsername(request.getToken());
        String newToken = jwtService.renewToken(request.getToken());
        
        return ResponseEntity.ok(new AuthResponse(newToken, jwtExpiration, username));
    }
}
