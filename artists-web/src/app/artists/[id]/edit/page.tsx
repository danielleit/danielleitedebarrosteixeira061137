"use client";

import { useEffect, useState } from "react";
import { useObservable } from "@/state/hooks/useObservable";
import { artistEditFacade } from "@/domain/artists/artist.edit.facade";
import { artistFacade } from "@/domain/artists/artist.facade";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { authFacade } from "@/state/auth/auth.facade";

export default function EditArtistPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const st = useObservable(artistEditFacade.state$, artistEditFacade.snapshot);

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
      artistEditFacade.reset();
      artistEditFacade.load(id);
    }
  }, [id, isCheckingAuth]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await artistEditFacade.save();
    router.push(`/artists/${id}`);
  }

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
      
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push(`/artists/${id}`)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1D1D1D] mb-8 transition-colors font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Detalhes
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1D1D1D]">Editar Artista</h1>
          <p className="text-gray-600 mt-2 text-lg">Atualize os dados do artista</p>
        </div>

        {/* Content */}
        {st.loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#FFBB38] mb-6"></div>
            <p className="text-gray-600 text-lg font-medium">Carregando dados...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-sm">
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Campo Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-bold text-[#1D1D1D] mb-3 uppercase tracking-wide">
                  Nome do Artista <span className="text-red-500">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  className="block w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-[#FFBB38] focus:ring-0 transition-all outline-none text-[#1D1D1D] text-lg"
                  value={st.name}
                  onChange={(e) => artistEditFacade.setName(e.target.value)}
                  placeholder="Nome do artista"
                />
                {!artistEditFacade.dirty && (
                  <p className="mt-3 text-sm text-gray-500">
                    💡 Nenhuma alteração detectada
                  </p>
                )}
              </div>

              {/* Mensagem de Erro */}
              {st.error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-lg flex items-center gap-3">
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{st.error}</span>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={st.saving || st.loading || !artistEditFacade.dirty || !st.name.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FFBB38] text-[#1D1D1D] rounded-lg hover:bg-[#E5A832] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-bold text-lg"
                >
                  {st.saving ? (
                    <>
                      <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Salvar Alterações
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/artists/${id}`)}
                  disabled={st.saving}
                  className="px-8 py-4 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
