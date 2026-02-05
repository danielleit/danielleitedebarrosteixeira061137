package br.gov.seplag.artists_api.album.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AlbumRequest {
    @NotBlank
    private String nome;

    @NotNull
    private Long artistId;
}
