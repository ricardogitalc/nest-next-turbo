"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function getUserData() {
  return typeof window !== "undefined" ? window.__USER_DATA__ : null;
}

export function UserProfile() {
  const [user, setUser] = useState<NonNullable<Window["__USER_DATA__"]>["user"]>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = getUserData();
    if (userData?.user) {
      setUser(userData.user);
      setName(userData.user.name || "");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || !user || name === user.name) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include",
      });
      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Perfil atualizado com sucesso.",
        });
        setUser((prevUser) => (prevUser ? { ...prevUser, name } : null));
      } else {
        throw new Error("Falha ao atualizar o perfil");
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

  if (!user) return null;

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
            <Button className="w-full p-5 mt-2" type="submit" disabled={isLoading || name === user.name}>
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
