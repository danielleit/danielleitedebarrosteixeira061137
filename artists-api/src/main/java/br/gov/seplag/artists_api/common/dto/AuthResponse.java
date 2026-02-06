package br.gov.seplag.artists_api.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long expiresIn; // em milissegundos
    private String username;

    public AuthResponse(String token, Long expiresIn, String username) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.username = username;
    }
}
