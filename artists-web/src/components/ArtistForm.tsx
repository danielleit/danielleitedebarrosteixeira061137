"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { artistFacade } from "@/domain/artists/artist.facade";

interface ArtistFormProps {
  initialData?: {
    id: string;
    nome: string;
  };
  isEdit?: boolean;
}

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;

export function ArtistForm({ initialData, isEdit = false }: ArtistFormProps) {
  const router = useRouter();
  const [nome, setNome] = useState(initialData?.nome || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateNome(value: string): string | null {
    const trimmed = value.trim();
    
    if (!trimmed) {
      return "Nome do artista é obrigatório";
    }
    
    if (trimmed.length < MIN_NAME_LENGTH) {
      return `Nome deve ter pelo menos ${MIN_NAME_LENGTH} caracteres`;
    }
    
    if (trimmed.length > MAX_NAME_LENGTH) {
      return `Nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres`;
    }
    
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validar antes de enviar
    const validationError = validateNome(nome);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (isEdit && initialData?.id) {
        // TODO: Implementar update quando criar o método no facade
        alert("Funcionalidade de edição em desenvolvimento");
        router.back();
      } else {
        const result = await artistFacade.createArtist({ nome: nome.trim() });
        if (result) {
          router.push("/artists");
        } else {
          setError("Erro ao criar artista");
        }
      }
    } catch (err: any) {
      setError(err.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  const isValid = nome.trim().length >= MIN_NAME_LENGTH && nome.trim().length <= MAX_NAME_LENGTH;
  const charCount = nome.length;
  const isNearLimit = charCount > MAX_NAME_LENGTH * 0.8;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Campo Nome */}
      <div>
        <label htmlFor="nome" className="block text-sm font-bold text-[#1D1D1D] mb-3 uppercase tracking-wide">
          Nome do Artista <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={MAX_NAME_LENGTH}
          required
          className="block w-full px-5 py-4 border-2 border-gray-200 rounded-lg focus:border-[#FFBB38] focus:ring-0 transition-all outline-none text-[#1D1D1D] text-lg"
          placeholder="Ex: The Beatles, Pink Floyd, etc."
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Digite o nome completo do artista ou banda (mín. {MIN_NAME_LENGTH} caracteres)
          </p>
          <p className={`text-sm font-mono ${isNearLimit ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>
            {charCount}/{MAX_NAME_LENGTH}
          </p>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
        <button
          type="submit"
          disabled={loading || !isValid}
          className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FFBB38] text-[#1D1D1D] rounded-lg hover:bg-[#E5A832] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-bold text-lg"
        >
          {loading ? (
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
              {isEdit ? "Atualizar Artista" : "Criar Artista"}
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded-lg hover:bg-[#1D1D1D] hover:text-white transition-all font-bold text-lg"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
