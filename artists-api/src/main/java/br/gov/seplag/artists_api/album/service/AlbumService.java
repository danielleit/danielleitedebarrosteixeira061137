package br.gov.seplag.artists_api.album.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.gov.seplag.artists_api.album.domain.Album;
import br.gov.seplag.artists_api.album.dto.AlbumRequest;
import br.gov.seplag.artists_api.album.dto.AlbumResponse;
import br.gov.seplag.artists_api.album.mapper.AlbumMapper;
import br.gov.seplag.artists_api.album.repository.AlbumRepository;
import br.gov.seplag.artists_api.artist.domain.Artist;
import br.gov.seplag.artists_api.artist.repository.ArtistRepository;
import br.gov.seplag.artists_api.common.storage.MinioService;
import br.gov.seplag.artists_api.common.service.GenericCrudService;
import jakarta.persistence.EntityNotFoundException;

@Service
public class AlbumService extends GenericCrudService<Album> {

    private final MinioService minioService;

    private final AlbumMapper mapper;
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;

    public AlbumService(
            AlbumRepository albumRepository,
            ArtistRepository artistRepository,
            AlbumMapper mapper, MinioService minioService) {

        super(albumRepository);
        this.albumRepository = albumRepository;
        this.artistRepository = artistRepository;
        this.mapper = mapper;
        this.minioService = minioService;
    }

    public AlbumResponse create(AlbumRequest request) {
        Artist artist = artistRepository.findById(request.getArtistId())
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado"));

        Album album = mapper.toEntity(request);
        album.setArtist(artist);

        return mapper.toResponse(save(album));
    }

    public AlbumResponse update(Long id, AlbumRequest request) {
        Album album = update(id, entity -> {
            entity.setNome(request.getNome());
        });

        return mapper.toResponse(album);
    }

    public Page<AlbumResponse> findByArtist(Long artistId, Pageable pageable) {
        return albumRepository
                .findByArtistIdAndExcluidoFalse(artistId, pageable)
                .map(mapper::toResponse);
    }

    public AlbumResponse toResponse(Album album) {
        return mapper.toResponse(album);
    }

    public AlbumResponse uploadImage(Long id, MultipartFile file) throws Exception {

        Album album = findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Album não encontrado"));

        String objectName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        minioService.upload(
                "albums",
                objectName,
                file.getInputStream(),
                file.getContentType());

        album.setImagePath(objectName);
        save(album);

        AlbumResponse response = mapper.toResponse(album);

        if (album.getImagePath() != null) {
            response.setImageUrl(
                    minioService.generatePresignedUrl("albums", album.getImagePath()));
        }

        return response;
    }

}
