package br.gov.seplag.artists_api.album.domain;

import br.gov.seplag.artists_api.artist.domain.Artist;
import br.gov.seplag.artists_api.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "album")
public class Album extends BaseEntity {

    @Column(nullable = false)
    private String nome;

    @Column(name = "image_path")
    private String imagePath;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artist_id")
    Artist artist;
}
