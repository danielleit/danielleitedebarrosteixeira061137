package br.gov.seplag.artists_api.common.service;

import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.springframework.data.jpa.repository.JpaRepository;

import br.gov.seplag.artists_api.common.domain.BaseEntity;
import jakarta.persistence.EntityNotFoundException;

public class GenericCrudService<T extends BaseEntity> {

    protected final JpaRepository<T, Long> repository;

    protected GenericCrudService(JpaRepository<T, Long> repository) {
        this.repository = repository;
    }

    public T save(T entity) {
        return repository.save(entity);
    }

    public Optional<T> findById(Long id) {
        return repository.findById(id).filter(e -> !Boolean.TRUE.equals(e.getExcluido()));
    }

    public T update(Long id, Consumer<T> updater) {
        T entity = findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Registro não encontrado"));

        updater.accept(entity);
        return repository.save(entity);
    }

    public void delete(Long id) {
        T entity = findById(id).orElseThrow(() -> new EntityNotFoundException("Registro não encontrado"));

        entity.setExcluido(true);
        repository.save(entity);
    }

    public List<T> findAll() {
        return repository.findAll().stream()
                .filter(e -> !Boolean.TRUE.equals(e.getExcluido()))
                .collect(Collectors.toList());
    }
}
