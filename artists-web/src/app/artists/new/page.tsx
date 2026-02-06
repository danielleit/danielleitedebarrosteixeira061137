"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArtistForm } from "@/components/ArtistForm";
import { Navbar } from "@/components/Navbar";
import { authFacade } from "@/state/auth/auth.facade";

export default function NewArtistPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const snapshot = authFacade.snapshot;
    if (!snapshot.isAuthenticated) {
      router.replace("/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [router]);

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
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1D1D1D] mb-8 transition-colors font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para Artistas
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1D1D1D]">Novo Artista</h1>
          <p className="text-gray-600 mt-2 text-lg">Preencha os dados para cadastrar um novo artista</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 shadow-sm">
          <ArtistForm />
        </div>
      </div>
    </div>
  );
}
