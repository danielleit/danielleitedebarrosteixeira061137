package br.gov.seplag.artists_api.artist.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistRequest {
    @NotBlank(message = "Nome é obrigatório")
    public String nome;
}
