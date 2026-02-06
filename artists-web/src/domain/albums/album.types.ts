export type Album = {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  coverUrl?: string | null;
};

export type PageMeta = { page: number; size: number; totalElements: number; totalPages: number };
export type AlbumPage = { content: Album[]; meta: PageMeta };
