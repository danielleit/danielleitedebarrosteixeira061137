"use client";
import { useRouter } from "next/navigation";
import { authFacade } from "@/state/auth/auth.facade";
import { useObservable } from "@/state/hooks/useObservable";

export function Navbar() {
  const router = useRouter();
  const authState = useObservable(authFacade.state, authFacade.snapshot);

  function handleLogout() {
    authFacade.logout();
    router.push("/login");
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => router.push("/artists")}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-[#1D1D1D] rounded flex items-center justify-center group-hover:bg-[#FFBB38] transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1D1D1D]">
              Artists<span className="text-[#FFBB38]">.</span>
            </span>
          </button>

          {/* Navigation Links */}
          {authState.isAuthenticated && (
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => router.push("/artists")}
                className="text-[#1D1D1D] font-medium hover:text-[#FFBB38] transition-colors relative group"
              >
                Artistas
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFBB38] group-hover:w-full transition-all"></span>
              </button>
            </div>
          )}

          {/* User Menu */}
          {authState.isAuthenticated && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFBB38] rounded-full flex items-center justify-center">
                  <span className="text-[#1D1D1D] font-bold text-sm">
                    {authState.tokens?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1D]">
                    {authState.tokens?.username || "Usuário"}
                  </p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#1D1D1D] text-[#1D1D1D] rounded hover:bg-[#1D1D1D] hover:text-white transition-all font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
