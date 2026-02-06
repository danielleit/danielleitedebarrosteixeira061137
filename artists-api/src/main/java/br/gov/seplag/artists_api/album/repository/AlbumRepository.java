package br.gov.seplag.artists_api.album.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.gov.seplag.artists_api.album.domain.Album;
import br.gov.seplag.artists_api.common.repository.BaseRepository;

public interface AlbumRepository extends BaseRepository<Album> {

    Page<Album> findByArtistIdAndExcluidoFalse(Long artistId, Pageable pageable);

    Page<Album> findByExcluidoFalse(Pageable pageable);

    long countByArtistIdAndExcluidoFalse(Long artistId);
}
