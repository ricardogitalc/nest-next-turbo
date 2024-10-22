import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: true,
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setIsLoading: (isLoading) => set({ isLoading }),
  checkAuthStatus: async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/logged", { credentials: "include" });
      const data = await response.json();
      set({ isLoggedIn: data.isLoggedIn, isLoading: false });
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      set({ isLoggedIn: false, isLoading: false });
    }
  },
}));
