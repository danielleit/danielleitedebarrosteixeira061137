package br.gov.seplag.artists_api.artist.domain;

import br.gov.seplag.artists_api.common.domain.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "artist")
public class Artist extends BaseEntity {

    @Column(nullable = false)
    private String nome;
}
