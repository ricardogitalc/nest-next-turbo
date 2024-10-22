"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Magic link enviado com sucesso! Verifique seu email.",
        });
      } else {
        const errorData = await response.json();
        if (
          response.status === 400 &&
          errorData.message &&
          errorData.message[0] === "Digite um email válido, por exemplo: email@gmail.com."
        ) {
          toast({
            title: "Erro de validação",
            description: "Digite um email válido, por exemplo: email@gmail.com.",
            variant: "destructive",
          });
        } else {
          throw new Error("Erro ao enviar magic link");
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar magic link. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
              type="email"
              required
            />
          </div>
        </div>
        <Button className="w-full p-5 mt-2" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar link mágico"
          )}
        </Button>
      </form>
      <Toaster />
    </>
  );
}

export default LoginForm;
