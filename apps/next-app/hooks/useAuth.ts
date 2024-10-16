import { useAuthStore } from "@/app/stores/authStore";
import { useEffect } from "react";

export function useAuth() {
  const { isLoggedIn, setIsLoggedIn } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [setIsLoggedIn]);

  return { isLoggedIn };
}
