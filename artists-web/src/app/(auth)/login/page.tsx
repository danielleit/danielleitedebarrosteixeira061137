"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authFacade } from "@/state/auth/auth.facade";

export default function LoginPage() {
  const router = useRouter();

  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => {
    return loading || !username.trim() || !password.trim();
  }, [loading, username, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await authFacade.login(username.trim(), password);
      router.replace("/artists");
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* fundo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/50" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-zinc-200/60 blur-3xl dark:bg-zinc-800/50" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
            {/* topo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                {/* Ícone de Música */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-zinc-900 dark:text-zinc-50"
                >
                  <path
                    d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zm12-3c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Entrar
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Acesse para gerenciar artistas e álbuns
                </p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {/* usuário */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Usuário
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    {/* ícone user */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 21a8 8 0 0 0-16 0"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <input
                    className="w-full rounded-xl border border-zinc-200 bg-white px-10 py-2.5 text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800/60"
                    placeholder="ex: admin"
                    value={username}
                    onChange={(e) => setU(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* senha */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  Senha
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                    {/* ícone lock */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 10V8a5 5 0 0 1 10 0v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 10h12v11H6V10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <input
                    className="w-full rounded-xl border border-zinc-200 bg-white px-10 py-2.5 pr-12 text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800/60"
                    placeholder="••••••••"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setP(e.target.value)}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto h-9 rounded-lg px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
                    aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPass ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {/* erro */}
              {err && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                  {err}
                </div>
              )}

              {/* botão */}
              <button
                disabled={disabled}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {loading && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900" />
                )}
                {loading ? "Entrando..." : "Entrar"}
              </button>

              {/* Credenciais padrão */}
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/40">
                <div className="flex items-start gap-2">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                      Credenciais padrão:
                    </p>
                    <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
                      Usuário: <span className="font-mono font-bold">admin</span>
                      <br />
                      Senha: <span className="font-mono font-bold">admin123</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-3">
                Após o login você será redirecionado para{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  /artists
                </span>
              </p>
            </form>
          </div>

          {/* rodapé */}
          <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} Artists — Login
          </p>
        </div>
      </div>
    </div>
  );
}
