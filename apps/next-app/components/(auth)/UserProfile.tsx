"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function UserProfile() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        credentials: "include",
      });
      const data = await response.json();
      setUser(data);
      setName(data.name || "");
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Simula um atraso de 3 segundos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      if (response.ok) {
        await fetchUserProfile();
        toast({
          title: "Sucesso!",
          description: "Perfil atualizado com sucesso.",
        });
      } else {
        const errorData = await response.json();
        if (errorData.message && Array.isArray(errorData.message)) {
          toast({
            title: "Erro de validação",
            description: errorData.message[0],
            variant: "destructive",
          });
        } else {
          throw new Error("Falha ao atualizar o perfil");
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-start h-screen mt-44">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <>
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-foreground-foreground mb-2">
                Email
              </label>
              <Input id="email" type="email" value={user.email} disabled />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-foreground-foreground mb-2">
                Nome
              </label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button className="w-full p-5 mt-2" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar Perfil"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}
