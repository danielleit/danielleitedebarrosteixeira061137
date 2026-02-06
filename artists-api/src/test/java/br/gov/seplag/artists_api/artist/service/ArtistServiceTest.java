package br.gov.seplag.artists_api.artist.service;

import br.gov.seplag.artists_api.album.repository.AlbumRepository;
import br.gov.seplag.artists_api.artist.domain.Artist;
import br.gov.seplag.artists_api.artist.dto.ArtistRequest;
import br.gov.seplag.artists_api.artist.dto.ArtistResponse;
import br.gov.seplag.artists_api.artist.mapper.ArtistMapper;
import br.gov.seplag.artists_api.artist.repository.ArtistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArtistServiceTest {

    @Mock
    private ArtistRepository artistRepository;

    @Mock
    private ArtistMapper artistMapper;

    @Mock
    private AlbumRepository albumRepository;

    private ArtistService artistService;

    @BeforeEach
    void setUp() {
        artistService = new ArtistService(artistRepository, artistMapper, albumRepository);
    }

    @Test
    void create_shouldCreateArtist() {
        // Arrange
        ArtistRequest request = new ArtistRequest();
        request.setNome("Test Artist");

        Artist entity = new Artist();
        entity.setNome("Test Artist");

        Artist savedEntity = new Artist();
        savedEntity.setId(1L);
        savedEntity.setNome("Test Artist");

        ArtistResponse expected = new ArtistResponse();
        expected.setId(1L);
        expected.setNome("Test Artist");

        when(artistMapper.toEntity(request)).thenReturn(entity);
        when(artistRepository.save(any(Artist.class))).thenReturn(savedEntity);
        when(artistMapper.toResponse(savedEntity)).thenReturn(expected);
        when(albumRepository.countByArtistIdAndExcluidoFalse(1L)).thenReturn(0L);

        // Act
        ArtistResponse result = artistService.create(request);

        // Assert
        assertNotNull(result);
        assertEquals("Test Artist", result.getNome());
        verify(artistRepository).save(any(Artist.class));
    }

    @Test
    void search_shouldReturnPagedResults() {
        // Arrange
        String nome = "Test";
        Pageable pageable = PageRequest.of(0, 10);

        Artist artist1 = new Artist();
        artist1.setId(1L);
        artist1.setNome("Test Artist 1");

        Artist artist2 = new Artist();
        artist2.setId(2L);
        artist2.setNome("Test Artist 2");

        Page<Artist> pagedArtists = new PageImpl<>(List.of(artist1, artist2));

        when(artistRepository.findByNomeContainingIgnoreCaseAndExcluidoFalse(nome, pageable))
                .thenReturn(pagedArtists);
        when(albumRepository.countByArtistIdAndExcluidoFalse(anyLong())).thenReturn(0L);

        ArtistResponse response1 = new ArtistResponse();
        response1.setId(1L);
        response1.setNome("Test Artist 1");

        ArtistResponse response2 = new ArtistResponse();
        response2.setId(2L);
        response2.setNome("Test Artist 2");

        when(artistMapper.toResponse(artist1)).thenReturn(response1);
        when(artistMapper.toResponse(artist2)).thenReturn(response2);

        // Act
        Page<ArtistResponse> result = artistService.search(nome, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        verify(artistRepository).findByNomeContainingIgnoreCaseAndExcluidoFalse(nome, pageable);
    }

    @Test
    void findById_shouldReturnArtist() {
        // Arrange
        Long id = 1L;
        Artist artist = new Artist();
        artist.setId(id);
        artist.setNome("Test Artist");

        when(artistRepository.findById(id)).thenReturn(Optional.of(artist));

        // Act
        Optional<Artist> result = artistService.findById(id);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Artist", result.get().getNome());
    }
}
