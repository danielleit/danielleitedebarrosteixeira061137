"use client";

import { BehaviorSubject } from "rxjs";
import { artistApi } from "@/domain/artists/artist.api";
import { albumApi } from "@/domain/albums/album.api";
import { albumImageApi } from "./albumImage.api";
import type { Artist } from "@/domain/artists/artist.types";
import type { AlbumPage } from "@/domain/albums/album.types";

type State = {
  loading: boolean;
  error: string | null;

  artistId: string | null;
  artist: Artist | null;

  albumsLoading: boolean;
  albumsError: string | null;
  albumsPage: number;
  albumsSize: number;
  albums: AlbumPage | null;

  covers: Record<string, string | null>;
};

const initial: State = {
  loading: false,
  error: null,
  artistId: null,
  artist: null,

  albumsLoading: false,
  albumsError: null,
  albumsPage: 0,
  albumsSize: 5,
  albums: null,

  covers: {},
};

class ArtistDetailFacade {
  private s = new BehaviorSubject<State>(initial);
  state$ = this.s.asObservable();
  get snapshot() { return this.s.value; }

  reset() { this.s.next(initial); }

  setAlbumsPage(page: number) {
    this.s.next({ ...this.snapshot, albumsPage: page });
  }

  async load(artistId: string) {
    this.s.next({ ...this.snapshot, loading: true, error: null, artistId });

    try {
      const artist = await artistApi.get(artistId);
      this.s.next({ ...this.snapshot, loading: false, artist });

      await this.loadAlbums();
    } catch (e: any) {
      this.s.next({ ...this.snapshot, loading: false, error: e?.message ?? "Erro ao carregar artista" });
    }
  }

  async loadAlbums() {
    const st = this.snapshot;
    if (!st.artistId) return;

    this.s.next({ ...st, albumsLoading: true, albumsError: null });

    try {
      const albums = await albumApi.listByArtist(st.artistId, {
        page: st.albumsPage,
        size: st.albumsSize,
        sort: "nome,asc",
      });

      this.s.next({ ...this.snapshot, albumsLoading: false, albums });

      // buscar capas da página atual (só se ainda não tem cache)
      await this.prefetchCovers(albums.content.map(a => a.id));
    } catch (e: any) {
      this.s.next({ ...this.snapshot, albumsLoading: false, albumsError: e?.message ?? "Erro ao carregar álbuns" });
    }
  }

  private async prefetchCovers(albumIds: string[]) {
    const st = this.snapshot;
    const missing = albumIds.filter(id => !(id in st.covers));
    if (missing.length === 0) return;

    // dispara em paralelo (limite simples)
    const results = await Promise.allSettled(
      missing.map(async (albumId) => {
        const imgs = await albumImageApi.list(albumId);
        return { albumId, url: imgs[0]?.url ?? null };
      })
    );

    const next = { ...this.snapshot.covers };
    for (const r of results) {
      if (r.status === "fulfilled") next[r.value.albumId] = r.value.url;
      else {
        // se falhar, marca null para não ficar refazendo sempre
        const albumId = (r as any).reason?.albumId;
        // não dá pra confiar, então ignora e deixa sem marcação
      }
    }

    this.s.next({ ...this.snapshot, covers: next });
  }
}

export const artistDetailFacade = new ArtistDetailFacade();
