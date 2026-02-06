package br.gov.seplag.artists_api.common.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Token é obrigatório")
    private String token;
}
