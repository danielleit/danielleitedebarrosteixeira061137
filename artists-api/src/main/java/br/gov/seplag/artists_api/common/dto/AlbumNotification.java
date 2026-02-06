package br.gov.seplag.artists_api.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para notificações WebSocket de novos álbuns.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlbumNotification {
    private String type;
    private Long albumId;
    private String albumName;
    private Long artistId;
    private String artistName;
    private String message;

    public static AlbumNotification newAlbum(Long albumId, String albumName, Long artistId, String artistName) {
        return new AlbumNotification(
                "NEW_ALBUM",
                albumId,
                albumName,
                artistId,
                artistName,
                "Novo álbum cadastrado: " + albumName + " - " + artistName
        );
    }
}
