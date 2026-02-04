package br.gov.seplag.artists_api.album.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlbumResponse {
    private Long id;
    private String nome;
    private Long artistId;
    private String artistNome;
    private String imageUrl;
}
