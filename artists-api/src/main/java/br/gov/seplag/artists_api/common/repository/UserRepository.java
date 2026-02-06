package br.gov.seplag.artists_api.common.repository;

import br.gov.seplag.artists_api.common.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndAtivoTrue(String username);
}
