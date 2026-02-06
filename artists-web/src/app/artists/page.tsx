"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { artistFacade } from "@/domain/artists/artist.facade";
import { useObservable } from "@/state/hooks/useObservable";
import { ArtistTable } from "@/components/ArtistTable";
import { Navbar } from "@/components/Navbar";
import { authFacade } from "@/state/auth/auth.facade";

export default function ArtistsPage() {
  const router = useRouter();
  const state = useObservable(artistFacade.state, artistFacade.snapshot);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const snapshot = authFacade.snapshot;
    if (!snapshot.isAuthenticated) {
      router.replace("/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!isCheckingAuth) {
      artistFacade.loadArtists();
    }
  }, [isCheckingAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FFBB38]"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const artists = state.artists?.content || [];
  const filteredArtists = searchTerm
    ? artists.filter((a) => a.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    : artists;

  const page = state.artists;

  function handlePageChange(newPage: number) {
    artistFacade.loadArtists({ page: newPage });
  }

  return (<div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header com Título e Botão */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-[#1D1D1D]">Artistas</h1>
              <p className="text-gray-600 mt-2 text-lg">Gerencie todos os artistas cadastrados</p>
            </div>
            <button
              onClick={() => router.push("/artists/new")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFBB38] text-[#1D1D1D] rounded-lg hover:bg-[#E5A832] transition-all shadow-lg hover:shadow-xl font-bold text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Artista
            </button>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-[#FFBB38] transition-all text-[#1D1D1D] text-lg"
              placeholder="Buscar artistas por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conteúdo */}
        {state.loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Carregando artistas...</p>
          </div>
        ) : state.error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Erro ao carregar artistas</p>
              <p className="text-sm">{state.error}</p>
            </div>
          </div>
        ) : (
          <>
            <ArtistTable artists={filteredArtists} />

            {/* Paginação */}
            {page && page.totalPages > 1 && !searchTerm && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg border-2 border-gray-200 p-6">
                <div className="text-sm text-gray-600">
                  Mostrando página <span className="font-bold text-[#1D1D1D]">{page.number + 1}</span> de{" "}
                  <span className="font-bold text-[#1D1D1D]">{page.totalPages}</span>
                  {" "}({page.totalElements} artistas no total)
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(page.number - 1)}
                    disabled={page.number === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1D1D1D] transition-all font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>

                  {/* Números de página */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: Math.min(5, page.totalPages) }, (_, i) => {
                      let pageNum;
                      if (page.totalPages <= 5) {
                        pageNum = i;
                      } else if (page.number < 3) {
                        pageNum = i;
                      } else if (page.number > page.totalPages - 4) {
                        pageNum = page.totalPages - 5 + i;
                      } else {
                        pageNum = page.number - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all ${
                            pageNum === page.number
                              ? "bg-[#FFBB38] text-[#1D1D1D] shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(page.number + 1)}
                    disabled={page.number + 1 >= page.totalPages}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1D1D1D] transition-all font-semibold"
                  >
                    Próxima
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            {!searchTerm && (
              <div className="mt-4 bg-white rounded-lg border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Mostrando <span className="font-bold text-[#1D1D1D] text-lg">{artists.length}</span> artistas nesta página
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-5 h-5 text-[#FFBB38]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Total de registros
                  </div>
                </div>
              </div>
            )}

            {/* Resultados da busca */}
            {searchTerm && (
              <div className="mt-8 bg-white rounded-lg border-2 border-gray-200 p-6">
                <p className="text-gray-600">
                  Encontrados <span className="font-bold text-[#1D1D1D] text-lg">{filteredArtists.length}</span> resultado(s) para "{searchTerm}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

