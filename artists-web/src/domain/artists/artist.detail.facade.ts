"use client";

import { BehaviorSubject } from "rxjs";
import { artistApi } from "@/domain/artists/artist.api";
import { albumApi } from "@/domain/albums/album.api";
import { albumImageApi } from "@/domain/albums/albumImage.api";
import type { Artist } from "@/domain/artists/artist.types";
import type { AlbumPage } from "@/domain/albums/album.types";

type ArtistDetailState = {
  loading: boolean;
  error: string | null;

  artistId: string | null;
  artist: Artist | null;

  albumsLoading: boolean;
  albumsError: string | null;
  albumsPage: number;
  albumsSize: number;
  albums: AlbumPage | null;

  // cache simples: albumId -> url da primeira capa
  covers: Record<string, string | null>;
};

const initial: ArtistDetailState = {
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
  private s = new BehaviorSubject<ArtistDetailState>(initial);
  state$ = this.s.asObservable();
  get snapshot() { return this.s.value; }

  reset() {
    this.s.next(initial);
  }

  setAlbumsPage(page: number) {
    this.s.next({ ...this.snapshot, albumsPage: page });
  }

  setAlbumsSize(size: number) {
    this.s.next({ ...this.snapshot, albumsSize: size, albumsPage: 0 });
  }

  async load(artistId: string) {
    this.s.next({ ...this.snapshot, loading: true, error: null, artistId });

    try {
      const artist = await artistApi.get(artistId);
      this.s.next({ ...this.snapshot, loading: false, artist });

      await this.loadAlbums();
    } catch (e: any) {
      this.s.next({ ...this.snapshot, loading: false, error: e?.message ?? "Erro ao carregar artista" });
      throw e;
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
      });

      this.s.next({ ...this.snapshot, albumsLoading: false, albums });

      await this.prefetchCovers(albums.content.map(a => a.id));
    } catch (e: any) {
      this.s.next({ ...this.snapshot, albumsLoading: false, albumsError: e?.message ?? "Erro ao carregar álbuns" });
      throw e;
    }
  }

  private async prefetchCovers(albumIds: string[]) {
    const st = this.snapshot;
    const missing = albumIds.filter(id => !(id in st.covers));
    if (missing.length === 0) return;

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

      }
    }

    this.s.next({ ...this.snapshot, covers: next });
  }
}

export const artistDetailFacade = new ArtistDetailFacade();
