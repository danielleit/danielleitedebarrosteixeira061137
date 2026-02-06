"use client";

import { BehaviorSubject } from "rxjs";
import { artistApi } from "@/domain/artists/artist.api";
import type { Artist } from "@/domain/artists/artist.types";

type ArtistEditState = {
  loading: boolean;
  saving: boolean;
  error: string | null;
  id: string | null;
  name: string;
  originalName: string;
};

const initial: ArtistEditState = {
  loading: false,
  saving: false,
  error: null,
  id: null,
  name: "",
  originalName: "",
};

class ArtistEditFacade {
  private s = new BehaviorSubject<ArtistEditState>(initial);
  state$ = this.s.asObservable();
  get snapshot() { return this.s.value; }

  reset() {
    this.s.next(initial);
  }

  setName(name: string) {
    this.s.next({ ...this.snapshot, name });
  }

  get dirty() {
    const st = this.snapshot;
    return st.name.trim() !== st.originalName.trim();
  }

  async load(id: string) {
    this.s.next({ ...this.snapshot, loading: true, error: null });

    try {
      const artist: Artist = await artistApi.get(id);

      this.s.next({
        ...this.snapshot,
        loading: false,
        id: artist.id,
        name: artist.name ?? "",
        originalName: artist.name ?? "",
      });
    } catch (e: any) {
      this.s.next({
        ...this.snapshot,
        loading: false,
        error: e?.message ?? "Erro ao carregar artista",
      });
      throw e;
    }
  }

  async save() {
    const st = this.snapshot;
    if (!st.id) throw new Error("Sem ID do artista");
    const name = st.name.trim();
    if (!name) throw new Error("Nome é obrigatório");

    this.s.next({ ...st, saving: true, error: null });

    try {
      await artistApi.update(st.id, { nome: name });

      this.s.next({
        ...this.snapshot,
        saving: false,
        originalName: name,
      });
    } catch (e: any) {
      this.s.next({
        ...this.snapshot,
        saving: false,
        error: e?.message ?? "Erro ao salvar",
      });
      throw e;
    }
  }
}

export const artistEditFacade = new ArtistEditFacade();
