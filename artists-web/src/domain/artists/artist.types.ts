export interface Artist {
  id: string;
  name: string;
  nome: string; // Alias para compatibilidade com backend
  albumCount?: number;
}

export interface ArtistPage {
  content: Artist[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ArtistRequest {
  nome: string;
}
