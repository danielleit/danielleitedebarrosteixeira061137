package br.gov.seplag.artists_api.artist.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtistResponse {
    private Long id;
    private String nome;
    private Long albumCount; // Número de álbuns
}
