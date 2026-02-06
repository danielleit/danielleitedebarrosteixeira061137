package br.gov.seplag.artists_api.artist.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.gov.seplag.artists_api.album.repository.AlbumRepository;
import br.gov.seplag.artists_api.artist.domain.Artist;
import br.gov.seplag.artists_api.artist.dto.ArtistRequest;
import br.gov.seplag.artists_api.artist.dto.ArtistResponse;
import br.gov.seplag.artists_api.artist.mapper.ArtistMapper;
import br.gov.seplag.artists_api.artist.repository.ArtistRepository;
import br.gov.seplag.artists_api.common.service.GenericCrudService;

@Service
public class ArtistService extends GenericCrudService<Artist> {

    private final ArtistMapper mapper;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;

    public ArtistService(ArtistRepository repository, ArtistMapper mapper, AlbumRepository albumRepository) {
        super(repository);
        this.artistRepository = repository;
        this.mapper = mapper;
        this.albumRepository = albumRepository;
    }

    public ArtistResponse toResponse(Artist artist) {
        ArtistResponse response = mapper.toResponse(artist);
        // Enriquecer com contagem de álbuns
        response.setAlbumCount(albumRepository.countByArtistIdAndExcluidoFalse(artist.getId()));
        return response;
    }

    public ArtistResponse create(ArtistRequest request) {
        Artist artist = mapper.toEntity(request);
        return toResponse(save(artist));
    }

    public ArtistResponse update(Long id, ArtistRequest request) {
        Artist updated = update(id, artist -> {
            artist.setNome(request.getNome());
        });

        return toResponse(updated);
    }

    public List<ArtistResponse> getAll() {
        return super.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<ArtistResponse> search(String nome, Pageable pageable) {
        if (nome != null && !nome.isBlank()) {
            return artistRepository.findByNomeContainingIgnoreCaseAndExcluidoFalse(nome, pageable)
                    .map(this::toResponse);
        }
        return artistRepository.findByExcluidoFalse(pageable)
                .map(this::toResponse);
    }
}
