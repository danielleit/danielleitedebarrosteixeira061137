import { httpClient } from "@/core/http/authInterceptor";
import { config } from "@/core/config";

export type AlbumImage = {
  id: string;
  url: string;
};

type AlbumImageDTO = {
  id: number;
  url: string;
};

export const albumImageApi = {
  async list(albumId: string): Promise<AlbumImage[]> {
    try {
      const data = await httpClient.get<AlbumImageDTO[]>(
        `${config.apiUrl}/api/v1/albuns/${albumId}/capas`
      );
      return data.map(i => ({ id: String(i.id), url: i.url }));
    } catch (error) {
      console.error('Erro ao buscar imagens do álbum:', error);
      return [];
    }
  },

  async upload(albumId: string, file: File): Promise<AlbumImage> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${config.apiUrl}/api/v1/albuns/${albumId}/capas`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('artists_token')}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao fazer upload: ${response.statusText}`);
    }

    const data: AlbumImageDTO = await response.json();
    return { id: String(data.id), url: data.url };
  },

  async delete(albumId: string, imageId: string): Promise<void> {
    await httpClient.delete(
      `${config.apiUrl}/api/v1/albuns/${albumId}/capas/${imageId}`
    );
  },
};
