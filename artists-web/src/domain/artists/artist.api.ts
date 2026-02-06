import { httpClient } from '@/core/http/authInterceptor';
import { config } from '@/core/config';
import type { Artist, ArtistPage, ArtistRequest } from './artist.types';

const BASE_URL = `${config.apiUrl}/api/v1/artists`;

export const artistApi = {
  async list(params: {
    page?: number;
    size?: number;
    nome?: string;
    sort?: string;
  }): Promise<ArtistPage> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', params.page.toString());
    if (params.size !== undefined) query.append('size', params.size.toString());
    if (params.nome) query.append('nome', params.nome);
    if (params.sort) query.append('sort', params.sort);

    return httpClient.get<ArtistPage>(`${BASE_URL}?${query}`);
  },

  async get(id: string): Promise<Artist> {
    const data = await httpClient.get<any>(`${BASE_URL}/${id}`);
    // Mapear nome para name também
    return {
      ...data,
      name: data.nome,
    };
  },

  async create(data: ArtistRequest): Promise<Artist> {
    const response = await httpClient.post<any>(BASE_URL, data);
    return {
      ...response,
      name: response.nome,
    };
  },

  async update(id: string, data: ArtistRequest): Promise<Artist> {
    const response = await httpClient.put<any>(`${BASE_URL}/${id}`, data);
    return {
      ...response,
      name: response.nome,
    };
  },

  async delete(id: string): Promise<void> {
    return httpClient.delete(`${BASE_URL}/${id}`);
  },
};
