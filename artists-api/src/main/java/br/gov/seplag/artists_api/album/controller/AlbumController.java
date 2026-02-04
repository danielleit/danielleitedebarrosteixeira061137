package br.gov.seplag.artists_api.album.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import br.gov.seplag.artists_api.album.dto.AlbumRequest;
import br.gov.seplag.artists_api.album.dto.AlbumResponse;
import br.gov.seplag.artists_api.album.service.AlbumService;

@RestController
@RequestMapping("/api/v1/albuns")
public class AlbumController {

    private final AlbumService service;

    public AlbumController(AlbumService service) {
        this.service = service;
    }

    @PostMapping
    public AlbumResponse create(@RequestBody AlbumRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AlbumResponse update(
            @PathVariable Long id,
            @RequestBody AlbumRequest request) {

        return service.update(id, request);
    }

    @GetMapping("/artista/{artistId}")
    public Page<AlbumResponse> findByArtist(
            @PathVariable Long artistId,
            Pageable pageable) {

        return service.findByArtist(artistId, pageable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public AlbumResponse uploadImage(
            @PathVariable Long id,
            @RequestParam MultipartFile file) throws Exception {

        return service.uploadImage(id, file);
    }

}
