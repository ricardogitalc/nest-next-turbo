import { useEffect, useState } from "react";

export function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Erro ao verificar o status de autenticação:", error);
        setIsLoggedIn(false);
      }

      setIsLoading(false);
    }

    checkAuthStatus();
  }, []);

  return { isLoggedIn, isLoading };
}
