"use client";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const validateToken = useCallback(
    async (tokenToValidate: string) => {
      try {
        const response = await fetch("http://localhost:3001/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenToValidate }),
        });
        const data = await response.json();
        if (data.valid) {
          document.cookie = `jwt=${data.jwt}; path=/; max-age=3600; secure; samesite=strict`;
          toast({
            title: "Sucesso",
            description: "Autenticação realizada com sucesso!",
            variant: "default",
          });
          router.push("/");
        } else {
          toast({
            title: "Erro de autenticação",
            description: "Token inválido ou expirado",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha na verificação do token. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [router, toast]
  );

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token, validateToken]);

  return (
    <div className="flex justify-center items-start h-screen mt-44">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default VerifyClient;
