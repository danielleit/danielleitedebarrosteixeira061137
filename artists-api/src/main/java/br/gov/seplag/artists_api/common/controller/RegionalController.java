package br.gov.seplag.artists_api.common.controller;

import br.gov.seplag.artists_api.common.domain.Regional;
import br.gov.seplag.artists_api.common.repository.RegionalRepository;
import br.gov.seplag.artists_api.common.service.RegionalSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciamento de regionais.
 */
@RestController
@RequestMapping("/api/v1/regionais")
@RequiredArgsConstructor
public class RegionalController {

    private final RegionalRepository regionalRepository;
    private final RegionalSyncService syncService;

    @GetMapping
    public Page<Regional> getAll(Pageable pageable) {
        return regionalRepository.findAll(pageable);
    }

    @GetMapping("/ativas")
    public List<Regional> getAtivas() {
        return regionalRepository.findByAtivoTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Regional> getById(@PathVariable Integer id) {
        return regionalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/sync")
    public ResponseEntity<String> syncManual() {
        return ResponseEntity.ok(syncService.syncManual());
    }
}
