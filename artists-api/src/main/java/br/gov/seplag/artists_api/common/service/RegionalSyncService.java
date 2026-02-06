package br.gov.seplag.artists_api.common.service;

import br.gov.seplag.artists_api.common.domain.Regional;
import br.gov.seplag.artists_api.common.dto.RegionalDto;
import br.gov.seplag.artists_api.common.repository.RegionalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Serviço para sincronização de regionais com API externa.
 * 
 * Algoritmo de sincronização (O(n)):
 * 1. Buscar dados da API externa
 * 2. Buscar dados locais
 * 3. Criar mapa de IDs existentes para comparação O(1)
 * 4. Para cada regional da API:
 *    - Se não existe localmente → inserir
 *    - Se existe e nome mudou → inativar antigo e criar novo
 * 5. Para regionais locais ativos não presentes na API → inativar
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RegionalSyncService {

    private final RegionalRepository regionalRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    
    private static final String API_URL = "https://integrador-argus-api.geia.vip/v1/regionais";

    /**
     * Sincroniza dados das regionais.
     * Executa automaticamente a cada 1 hora.
     */
    @Scheduled(fixedDelay = 3600000, initialDelay = 10000) // 1 hora
    @Transactional
    public void syncRegionais() {
        log.info("Iniciando sincronização de regionais...");

        try {
            // 1. Buscar dados da API externa
            List<RegionalDto> apiRegionais = fetchRegionaisFromApi();
            if (apiRegionais == null || apiRegionais.isEmpty()) {
                log.warn("Nenhuma regional retornada da API externa");
                return;
            }

            // 2. Buscar todas as regionais locais
            List<Regional> localRegionais = regionalRepository.findAll();

            // 3. Criar mapa para acesso O(1)
            Map<Integer, Regional> localMap = localRegionais.stream()
                    .collect(Collectors.toMap(Regional::getId, r -> r));

            Set<Integer> apiIds = new HashSet<>();

            // 4. Processar regionais da API
            for (RegionalDto apiDto : apiRegionais) {
                apiIds.add(apiDto.getId());
                Regional local = localMap.get(apiDto.getId());

                if (local == null) {
                    // Novo → inserir
                    insertRegional(apiDto);
                } else if (!local.getNome().equals(apiDto.getNome())) {
                    // Nome alterado → inativar e criar novo
                    updateRegional(local, apiDto);
                }
                // Senão, não faz nada (já está correto)
            }

            // 5. Inativar regionais que não estão mais na API
            for (Regional local : localRegionais) {
                if (local.getAtivo() && !apiIds.contains(local.getId())) {
                    inativarRegional(local);
                }
            }

            log.info("Sincronização concluída com sucesso!");

        } catch (Exception e) {
            log.error("Erro ao sincronizar regionais: {}", e.getMessage(), e);
        }
    }

    private List<RegionalDto> fetchRegionaisFromApi() {
        try {
            ResponseEntity<List<RegionalDto>> response = restTemplate.exchange(
                    API_URL,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<RegionalDto>>() {}
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Erro ao buscar regionais da API: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private void insertRegional(RegionalDto dto) {
        Regional regional = new Regional();
        regional.setId(dto.getId());
        regional.setNome(dto.getNome());
        regional.setAtivo(true);
        regionalRepository.save(regional);
        log.info("Regional inserida: {} - {}", dto.getId(), dto.getNome());
    }

    private void updateRegional(Regional existing, RegionalDto dto) {
        // Inativar o registro antigo
        existing.setAtivo(false);
        regionalRepository.save(existing);

        // Criar novo registro com nome atualizado
        Regional novo = new Regional();
        novo.setId(dto.getId());
        novo.setNome(dto.getNome());
        novo.setAtivo(true);
        regionalRepository.save(novo);

        log.info("Regional atualizada: {} - {} → {}", dto.getId(), existing.getNome(), dto.getNome());
    }

    private void inativarRegional(Regional regional) {
        regional.setAtivo(false);
        regionalRepository.save(regional);
        log.info("Regional inativada: {} - {}", regional.getId(), regional.getNome());
    }

    /**
     * Sincronização manual via endpoint.
     */
    public String syncManual() {
        syncRegionais();
        return "Sincronização iniciada";
    }
}
