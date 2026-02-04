package br.gov.seplag.artists_api.album.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import br.gov.seplag.artists_api.album.domain.Album;
import br.gov.seplag.artists_api.album.dto.AlbumRequest;
import br.gov.seplag.artists_api.album.dto.AlbumResponse;
import br.gov.seplag.artists_api.common.mapper.BaseMapper;

@Mapper(componentModel = "spring")
public interface AlbumMapper
        extends BaseMapper<Album, AlbumRequest, AlbumResponse> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "excluido", ignore = true)
    @Mapping(target = "artist", ignore = true)
    Album toEntity(AlbumRequest request);

    @Override
    @Mapping(target = "artistId", source = "artist.id")
    @Mapping(target = "artistNome", source = "artist.nome")
    AlbumResponse toResponse(Album entity);
}
