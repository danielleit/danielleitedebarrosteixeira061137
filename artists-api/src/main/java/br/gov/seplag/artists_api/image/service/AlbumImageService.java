package br.gov.seplag.artists_api.image.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.gov.seplag.artists_api.album.domain.Album;
import br.gov.seplag.artists_api.album.repository.AlbumRepository;
import br.gov.seplag.artists_api.common.storage.MinioService;
import br.gov.seplag.artists_api.image.domain.AlbumImage;
import br.gov.seplag.artists_api.image.dto.AlbumImageResponse;
import br.gov.seplag.artists_api.image.repository.AlbumImageRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class AlbumImageService {

    private static final String BUCKET = "album-capas";

    private final AlbumRepository albumRepository;
    private final AlbumImageRepository imageRepository;
    private final MinioService minioService;

    public AlbumImageService(
            AlbumRepository albumRepository,
            AlbumImageRepository imageRepository,
            MinioService minioService) {

        this.albumRepository = albumRepository;
        this.imageRepository = imageRepository;
        this.minioService = minioService;
    }

    public AlbumImageResponse upload(Long albumId, MultipartFile file) {
        try {
            Album album = albumRepository.findById(albumId)
                    .orElseThrow(() -> new EntityNotFoundException("Álbum não encontrado"));

            String objectName = albumId + "/" + UUID.randomUUID();

            String contentType = file.getContentType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            minioService.upload(
                    BUCKET,
                    objectName,
                    file.getInputStream(),
                    contentType
            );

            AlbumImage image = new AlbumImage();
            image.setAlbum(album);
            image.setBucket(BUCKET);
            image.setObjectName(objectName);

            imageRepository.save(image);

            AlbumImageResponse response = new AlbumImageResponse();
            response.setId(image.getId());
            response.setUrl(
                    minioService.generatePresignedUrl(BUCKET, objectName)
            );

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao realizar upload da imagem", e);
        }
    }

    public List<AlbumImageResponse> listByAlbum(Long albumId) {
        return imageRepository.findByAlbumIdAndExcluidoFalse(albumId)
                .stream()
                .map(img -> {
                    try {
                        AlbumImageResponse r = new AlbumImageResponse();
                        r.setId(img.getId());
                        r.setUrl(
                                minioService.generatePresignedUrl(
                                        img.getBucket(),
                                        img.getObjectName()
                                )
                        );
                        return r;
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
    }
}
