import { httpClient } from "@/core/http/authInterceptor";
import { config } from "@/core/config";
import type { AlbumPage, Album } from "./album.types";

type AlbumApiDTO = {
  id: number;
  nome: string;
  artistId: number;
  artistNome: string;
};

type SpringPageDTO<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export const albumApi = {
  listByArtist: async (artistId: string, params: { page: number; size: number; sort?: string }) => {
    const usp = new URLSearchParams();
    usp.set("page", String(params.page));
    usp.set("size", String(params.size));
    if (params.sort) usp.set("sort", params.sort); 

    const dto = await httpClient.get<SpringPageDTO<AlbumApiDTO>>(
      `${config.apiUrl}/api/v1/albuns/artista/${artistId}?${usp.toString()}`
    );

    const content: Album[] = dto.content.map(a => ({
      id: String(a.id),
      name: a.nome,
      artistId: String(a.artistId),
      artistName: a.artistNome,
    }));

    return {
      content,
      meta: {
        page: dto.number,
        size: dto.size,
        totalElements: dto.totalElements,
        totalPages: dto.totalPages,
      },
    } satisfies AlbumPage;
  },

  create: async (artistId: string, data: { nome: string }): Promise<string> => {
    const response = await httpClient.post<AlbumApiDTO>(
      `${config.apiUrl}/api/v1/albuns`,
      {
        nome: data.nome,
        artistId: Number(artistId),
      }
    );
    return String(response.id);
  },

  delete: async (albumId: string): Promise<void> => {
    await httpClient.delete(`${config.apiUrl}/api/v1/albuns/${albumId}`);
  },
};
