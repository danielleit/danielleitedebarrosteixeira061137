package br.gov.seplag.artists_api.album.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.gov.seplag.artists_api.album.dto.AlbumRequest;
import br.gov.seplag.artists_api.album.dto.AlbumResponse;
import br.gov.seplag.artists_api.album.service.AlbumService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/albuns")
public class AlbumController {

    private final AlbumService service;

    public AlbumController(AlbumService service) {
        this.service = service;
    }

    @PostMapping
    public AlbumResponse create(@Valid @RequestBody AlbumRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public AlbumResponse update(@PathVariable Long id, @Valid @RequestBody AlbumRequest request) {
        return service.update(id, request);
    }

    @GetMapping("/artista/{artistId}")
    public Page<AlbumResponse> findByArtist(@PathVariable Long artistId, Pageable pageable) {
        return service.findByArtist(artistId, pageable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public Page<AlbumResponse> getAll(Pageable pageable){
        return service.getAll(pageable);
    }
}
