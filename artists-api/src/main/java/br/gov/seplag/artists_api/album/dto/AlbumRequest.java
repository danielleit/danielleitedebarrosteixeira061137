package br.gov.seplag.artists_api.album.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlbumRequest {
    private String nome;
    private Long artistId;
}
