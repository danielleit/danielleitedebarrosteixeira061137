package br.gov.seplag.artists_api.image.domain;

import br.gov.seplag.artists_api.album.domain.Album;
import br.gov.seplag.artists_api.common.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "album_image")
public class AlbumImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "album_id")
    private Album album;

    @Column(nullable = false)
    private String bucket;

    @Column(nullable = false)
    private String objectName;
}
