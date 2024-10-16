import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    }),
    {
      name: "auth-storage",
    }
  )
);
