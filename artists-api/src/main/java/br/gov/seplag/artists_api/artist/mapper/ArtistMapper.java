package br.gov.seplag.artists_api.artist.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import br.gov.seplag.artists_api.artist.domain.Artist;
import br.gov.seplag.artists_api.artist.dto.ArtistRequest;
import br.gov.seplag.artists_api.artist.dto.ArtistResponse;
import br.gov.seplag.artists_api.common.mapper.BaseMapper;

@Mapper(componentModel = "spring")
public interface ArtistMapper 
        extends BaseMapper<Artist, ArtistRequest, ArtistResponse> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "excluido", ignore = true)
    Artist toEntity(ArtistRequest request);
}