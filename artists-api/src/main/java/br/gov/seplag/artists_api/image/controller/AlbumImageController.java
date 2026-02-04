package br.gov.seplag.artists_api.image.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.gov.seplag.artists_api.image.dto.AlbumImageResponse;
import br.gov.seplag.artists_api.image.service.AlbumImageService;

@RestController
@RequestMapping("/api/v1/albuns/{albumId}/capas")
public class AlbumImageController {

    private final AlbumImageService service;

    public AlbumImageController(AlbumImageService service) {
        this.service = service;
    }

    @PostMapping
    public AlbumImageResponse upload(
            @PathVariable Long albumId,
            @RequestParam MultipartFile file) {

        return service.upload(albumId, file);
    }

    @GetMapping
    public List<AlbumImageResponse> list(@PathVariable Long albumId) {
        return service.listByAlbum(albumId);
    }
}
