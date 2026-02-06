"use client";

import { BehaviorSubject } from "rxjs";
import { artistApi } from "@/domain/artists/artist.api";
import type { Artist, ArtistPage, ArtistRequest } from "@/domain/artists/artist.types";

interface ArtistFacadeState {
  loading: boolean;
  error: string | null;
  artists: ArtistPage | null;
  page: number;
  size: number;
  searchTerm: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: ArtistFacadeState = {
  loading: false,
  error: null,
  artists: null,
  page: 0,
  size: 10,
  searchTerm: '',
  sortOrder: 'asc',
};

class ArtistFacade {
  private state$ = new BehaviorSubject<ArtistFacadeState>(initialState);

  get snapshot() {
    return this.state$.value;
  }

  get state() {
    return this.state$.asObservable();
  }

  async loadArtists(params?: { page?: number; size?: number; nome?: string; sort?: 'asc' | 'desc' }) {
    const page = params?.page ?? this.state$.value.page;
    const size = params?.size ?? this.state$.value.size;
    const nome = params?.nome ?? this.state$.value.searchTerm;
    const sortOrder = params?.sort ?? this.state$.value.sortOrder;

    this.state$.next({
      ...this.state$.value,
      loading: true,
      error: null,
      page,
      size,
      searchTerm: nome,
      sortOrder,
    });

    try {
      const artists = await artistApi.list({
        page,
        size,
        nome: nome || undefined,
        sort: `nome,${sortOrder}`,
      });

      this.state$.next({
        ...this.state$.value,
        loading: false,
        artists,
      });
    } catch (error: any) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: error.message || 'Erro ao carregar artistas',
      });
    }
  }

  async createArtist(data: ArtistRequest): Promise<Artist | null> {
    this.state$.next({ ...this.state$.value, loading: true, error: null });

    try {
      const artist = await artistApi.create(data);
      this.state$.next({ ...this.state$.value, loading: false });
      return artist;
    } catch (error: any) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: error.message || 'Erro ao criar artista',
      });
      return null;
    }
  }

  async deleteArtist(id: string): Promise<boolean> {
    try {
      await artistApi.delete(id);
      // Recarregar lista
      await this.loadArtists();
      return true;
    } catch (error: any) {
      this.state$.next({
        ...this.state$.value,
        error: error.message || 'Erro ao excluir artista',
      });
      return false;
    }
  }

  setPage(page: number) {
    this.loadArtists({ page });
  }

  setSize(size: number) {
    this.loadArtists({ size, page: 0 });
  }

  setSearchTerm(searchTerm: string) {
    this.loadArtists({ nome: searchTerm, page: 0 });
  }

  setSortOrder(sortOrder: 'asc' | 'desc') {
    this.loadArtists({ sort: sortOrder });
  }

  reset() {
    this.state$.next(initialState);
  }

  clearError() {
    this.state$.next({ ...this.state$.value, error: null });
  }
}

export const artistFacade = new ArtistFacade();
