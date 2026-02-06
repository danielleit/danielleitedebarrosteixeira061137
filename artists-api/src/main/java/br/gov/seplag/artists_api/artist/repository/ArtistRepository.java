package br.gov.seplag.artists_api.artist.repository;

import br.gov.seplag.artists_api.artist.domain.Artist;
import br.gov.seplag.artists_api.common.repository.BaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ArtistRepository extends BaseRepository<Artist> {
    Page<Artist> findByNomeContainingIgnoreCaseAndExcluidoFalse(String nome, Pageable pageable);
    Page<Artist> findByExcluidoFalse(Pageable pageable);
}
