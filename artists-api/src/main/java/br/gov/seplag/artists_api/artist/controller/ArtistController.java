package br.gov.seplag.artists_api.artist.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import br.gov.seplag.artists_api.artist.dto.ArtistRequest;
import br.gov.seplag.artists_api.artist.dto.ArtistResponse;
import br.gov.seplag.artists_api.artist.service.ArtistService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/artists")
public class ArtistController {

    @Autowired
    ArtistService service;

    @PostMapping
    public ArtistResponse create(@Valid @RequestBody ArtistRequest request) {
        return service.create(request);
    }

    @GetMapping("/id")
    public ArtistResponse get(@PathVariable Long id) {
        return service.findById(id).map(service::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Artista não encontrado"));
    }

    @PutMapping("/id")
    public ArtistResponse update(@PathVariable Long id, @RequestBody ArtistRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/id")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
