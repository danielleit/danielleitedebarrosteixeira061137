"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useObservable } from "@/state/hooks/useObservable";
import { artistDetailFacade } from "@/domain/artists/artist.detail.facade";
import { Navbar } from "@/components/Navbar";
import { AlbumForm } from "@/components/AlbumForm";
import { authFacade } from "@/state/auth/auth.facade";

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const st = useObservable(artistDetailFacade.state$, artistDetailFacade.snapshot);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
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
      artistDetailFacade.reset();
      artistDetailFacade.load(id);
    }
  }, [id, isCheckingAuth]);

  useEffect(() => {
    if (st.artistId) artistDetailFacade.loadAlbums();
  }, [st.albumsPage]);

  const page = st.albums?.meta;

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

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1D1D1D] mb-8 transition-colors font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Artistas
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 mb-10 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-[#1D1D1D] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-3xl">
                  {st.artist?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#1D1D1D]">
                  {st.artist?.name ?? "Artista"}
                </h1>
                <p className="text-gray-600 mt-1 text-lg">Álbuns cadastrados</p>
              </div>
            </div>

            <Link
              href={`/artists/${id}/edit`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFBB38] text-[#1D1D1D] rounded-lg hover:bg-[#E5A832] transition-all shadow-lg hover:shadow-xl font-bold text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar Artista
            </Link>
          </div>
        </div>

        {/* Loading States */}
        {st.loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#FFBB38] mb-6"></div>
            <p className="text-gray-600 text-lg font-medium">Carregando artista...</p>
          </div>
        )}
        
        {st.error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-5 rounded-lg flex items-center gap-3">
            <svg className="w-7 h-7 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-bold text-lg">Erro ao carregar artista</p>
              <p className="text-sm">{st.error}</p>
            </div>
          </div>
        )}

        {/* Albums Section */}
        {!st.loading && !st.error && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#1D1D1D]">Álbuns</h2>
              <div className="flex items-center gap-4">
                {st.albums && st.albums.content.length > 0 && (
                  <span className="px-5 py-2 bg-[#FFBB38] text-[#1D1D1D] rounded-lg text-base font-bold">
                    {st.albums.meta.totalElements} {st.albums.meta.totalElements === 1 ? "álbum" : "álbuns"}
                  </span>
                )}
                <button
                  onClick={() => setShowAddAlbum(!showAddAlbum)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D1D1D] text-white rounded-lg hover:bg-[#333] transition-all font-bold shadow-md hover:shadow-lg"
                >
                  {showAddAlbum ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancelar
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Adicionar Álbum
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Formulário de Adicionar Álbum */}
            {showAddAlbum && (
              <div className="mb-8">
                <AlbumForm
                  artistId={id}
                  onSubmit={async (data) => {
                    const albumId = await artistDetailFacade.createAlbum(data);
                    if (albumId) {
                      setShowAddAlbum(false);
                    }
                    return albumId;
                  }}
                  onCancel={() => setShowAddAlbum(false)}
                />
              </div>
            )}

            {st.albumsLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FFBB38]"></div>
              </div>
            )}
            
            {st.albumsError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg font-semibold">
                {st.albumsError}
              </div>
            )}

            {!st.albumsLoading && st.albums && st.albums.content.length === 0 && (
              <div className="bg-white rounded-lg border-2 border-gray-200 p-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1D] mb-2">Nenhum álbum cadastrado</h3>
                <p className="text-gray-500 text-lg">Este artista ainda não possui álbuns cadastrados.</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {st.albums?.content?.map(al => {
                const cover = st.covers[al.id] ?? null;

                return (
                  <div key={al.id} className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#FFBB38] transition-all group">
                    {cover ? (
                      <img
                        src={cover}
                        alt={al.name}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-[#FFBB38] group-hover:to-[#E5A832] transition-all">
                        <svg className="w-20 h-20 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-[#1D1D1D] text-lg truncate group-hover:text-[#FFBB38] transition-colors" title={al.name}>
                        {al.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{al.artistName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {page && page.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
              disabled={page.page === 0}
              onClick={() => artistDetailFacade.setAlbumsPage(page.page - 1)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            <span className="px-6 py-3 bg-white border-2 border-gray-200 rounded-lg font-bold text-[#1D1D1D]">
              Página {page.page + 1} de {page.totalPages}
            </span>

            <button
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
              disabled={page.page + 1 >= page.totalPages}
              onClick={() => artistDetailFacade.setAlbumsPage(page.page + 1)}
            >
              Próxima
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
