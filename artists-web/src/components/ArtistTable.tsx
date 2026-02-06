"use client";
import { useRouter } from "next/navigation";
import type { Artist } from "@/domain/artists/artist.types";
import { artistFacade } from "@/domain/artists/artist.facade";

interface ArtistTableProps {
  artists: Artist[];
}

export function ArtistTable({ artists }: ArtistTableProps) {
  const router = useRouter();

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Deseja realmente excluir o artista "${nome}"?`)) {
      return;
    }
    
    const success = await artistFacade.deleteArtist(id);
    if (success) {
      alert("Artista excluído com sucesso!");
    }
  }

  if (artists.length === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-[#1D1D1D] mb-2">Nenhum artista encontrado</h3>
        <p className="text-gray-500 text-lg">Comece adicionando seu primeiro artista</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#1D1D1D]">
            <tr>
              <th className="px-8 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                Artista
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                Álbuns
              </th>
              <th className="px-8 py-5 text-right text-sm font-bold text-white uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {artists.map((artist, idx) => (
              <tr 
                key={artist.id} 
                className="hover:bg-gray-50 transition-colors group"
                style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}
              >
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-[#1D1D1D] group-hover:bg-[#FFBB38] rounded-lg flex items-center justify-center transition-colors">
                      <span className="text-white group-hover:text-[#1D1D1D] font-bold text-xl">
                        {artist.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#1D1D1D]">{artist.nome}</div>
                      <div className="text-sm text-gray-500">ID: {artist.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-[#FFBB38] text-[#1D1D1D]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    {artist.albumCount || 0}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => router.push(`/artists/${artist.id}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white transition-all font-semibold"
                      title="Ver detalhes"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver
                    </button>
                    <button
                      onClick={() => router.push(`/artists/${artist.id}/edit`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFBB38] text-[#1D1D1D] rounded-lg hover:bg-[#E5A832] transition-all font-semibold shadow-md hover:shadow-lg"
                      title="Editar artista"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(artist.id, artist.nome)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold"
                      title="Excluir artista"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y-2 divide-gray-200">
        {artists.map((artist) => (
          <div key={artist.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-14 h-14 bg-[#1D1D1D] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {artist.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-base font-bold text-[#1D1D1D]">{artist.nome}</div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 text-sm font-bold rounded-lg bg-[#FFBB38] text-[#1D1D1D]">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    {artist.albumCount || 0}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => router.push(`/artists/${artist.id}`)}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver
              </button>
              <button
                onClick={() => router.push(`/artists/${artist.id}/edit`)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FFBB38] text-[#1D1D1D] rounded-lg hover:bg-[#E5A832] transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={() => handleDelete(artist.id, artist.nome)}
                className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
