package br.gov.seplag.artists_api.image.repository;

import java.util.List;

import br.gov.seplag.artists_api.common.repository.BaseRepository;
import br.gov.seplag.artists_api.image.domain.AlbumImage;

public interface AlbumImageRepository extends BaseRepository<AlbumImage> {

    List<AlbumImage> findByAlbumIdAndExcluidoFalse(Long albumId);
}
