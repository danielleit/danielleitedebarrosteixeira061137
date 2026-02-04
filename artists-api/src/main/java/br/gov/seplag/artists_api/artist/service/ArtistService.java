package br.gov.seplag.artists_api.artist.service;

import br.gov.seplag.artists_api.artist.domain.Artist;
import br.gov.seplag.artists_api.artist.dto.ArtistRequest;
import br.gov.seplag.artists_api.artist.dto.ArtistResponse;
import br.gov.seplag.artists_api.artist.mapper.ArtistMapper;
import br.gov.seplag.artists_api.artist.repository.ArtistRepository;
import br.gov.seplag.artists_api.common.service.GenericCrudService;

public class ArtistService extends GenericCrudService<Artist> {

    private final ArtistMapper mapper;

    public ArtistService(ArtistRepository repository, ArtistMapper mapper) {
        super(repository);
        this.mapper = mapper;
    }

    public ArtistResponse toResponse(Artist artist) {
        return mapper.toResponse(artist);
    }

    public ArtistResponse create(ArtistRequest request) {
        Artist artist = mapper.toEntity(request);
        return mapper.toResponse(save(artist));
    }

    public ArtistResponse update(Long id, ArtistRequest request) {
        Artist updated = update(id, artist -> {
            artist.setNome(request.getNome());
        });

        return mapper.toResponse(updated);
    }
}
