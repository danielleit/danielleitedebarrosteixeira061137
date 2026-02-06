package br.gov.seplag.artists_api.common.repository;

import br.gov.seplag.artists_api.common.domain.Regional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegionalRepository extends JpaRepository<Regional, Integer> {
    List<Regional> findByAtivoTrue();
    Optional<Regional> findByIdAndAtivoTrue(Integer id);
}
