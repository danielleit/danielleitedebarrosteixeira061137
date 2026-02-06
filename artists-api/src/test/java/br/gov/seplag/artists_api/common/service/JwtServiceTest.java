package br.gov.seplag.artists_api.common.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String testUsername = "testuser";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // Configurar valores via reflection
        ReflectionTestUtils.setField(jwtService, "secretKey", 
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 300000L);
    }

    @Test
    void generateToken_shouldCreateValidToken() {
        // Act
        String token = jwtService.generateToken(testUsername);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractUsername_shouldReturnCorrectUsername() {
        // Arrange
        String token = jwtService.generateToken(testUsername);

        // Act
        String extractedUsername = jwtService.extractUsername(token);

        // Assert
        assertEquals(testUsername, extractedUsername);
    }

    @Test
    void isTokenValid_shouldReturnTrue_forValidToken() {
        // Arrange
        String token = jwtService.generateToken(testUsername);

        // Act
        boolean isValid = jwtService.isTokenValid(token, testUsername);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void isTokenValid_shouldReturnFalse_forWrongUsername() {
        // Arrange
        String token = jwtService.generateToken(testUsername);

        // Act
        boolean isValid = jwtService.isTokenValid(token, "wronguser");

        // Assert
        assertFalse(isValid);
    }

    @Test
    void renewToken_shouldGenerateNewToken() {
        // Arrange
        String originalToken = jwtService.generateToken(testUsername);

        // Act
        String renewedToken = jwtService.renewToken(originalToken);

        // Assert
        assertNotNull(renewedToken);
        assertFalse(renewedToken.isEmpty());
        assertNotEquals(originalToken, renewedToken);
        assertEquals(testUsername, jwtService.extractUsername(renewedToken));
    }
}
