"use client";

import { useState, useRef } from "react";
import { albumImageApi } from "@/domain/albums/albumImage.api";

interface AlbumFormProps {
  artistId: string;
  onSubmit: (data: { nome: string }) => Promise<string | null>;
  onCancel: () => void;
}

export function AlbumForm({ artistId, onSubmit, onCancel }: AlbumFormProps) {
  const [nome, setNome] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Formato inválido. Use apenas JPG, PNG ou WEBP");
      setFile(null);
      setPreview(null);
      return;
    }

    // Validar tamanho
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Arquivo muito grande. Tamanho máximo: 5MB");
      setFile(null);
      setPreview(null);
      return;
    }

    setError(null);
    setFile(selectedFile);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!nome.trim()) {
      setError("Nome do álbum é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Criar o álbum
      const albumId = await onSubmit({ nome: nome.trim() });
      
      if (!albumId) {
        throw new Error("Erro ao criar álbum");
      }

      // 2. Se houver imagem, fazer upload
      if (file) {
        await albumImageApi.upload(albumId, file);
      }

      // Sucesso - resetar form
      setNome("");
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err?.message ?? "Erro ao criar álbum");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#1D1D1D]">Adicionar Novo Álbum</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome do Álbum */}
        <div>
          <label className="block text-sm font-bold text-[#1D1D1D] mb-2">
            Nome do Álbum *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FFBB38] transition-all text-[#1D1D1D]"
            placeholder="Ex: Greatest Hits"
            maxLength={100}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            {nome.length}/100 caracteres
          </p>
        </div>

        {/* Upload de Capa */}
        <div>
          <label className="block text-sm font-bold text-[#1D1D1D] mb-2">
            Capa do Álbum (opcional)
          </label>
          
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#FFBB38] transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="album-cover"
                disabled={loading}
              />
              <label
                htmlFor="album-cover"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1D]">
                    Clique para selecionar uma imagem
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG ou WEBP (máx. 5MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="mt-2 text-xs text-gray-600">
                {file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !nome.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FFBB38] text-[#1D1D1D] rounded-lg hover:bg-[#E5A832] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-md hover:shadow-lg"
          >
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1D1D1D]"></div>
            )}
            {loading ? "Criando..." : "Criar Álbum"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
