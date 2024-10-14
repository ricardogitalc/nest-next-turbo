"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function VerifyPage() {
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "success" | "error">("verifying");
  const router = useRouter();
  const searchParams = useSearchParams();

  const verifyToken = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(`http://localhost:3001/auth/verify?token=${token}`);

        if (response.ok) {
          setVerificationStatus("success");
          localStorage.setItem("authToken", token);
          setTimeout(() => router.push("/"), 3000);
        } else {
          setVerificationStatus("error");
        }
      } catch (error) {
        setVerificationStatus("error");
      }
    },
    [router]
  );

  useEffect(() => {
    const token = searchParams.get("token")?.toString();

    if (token) {
      verifyToken(token);
    }
  }, [searchParams, verifyToken]);

  const renderStatusIcon = () => {
    switch (verificationStatus) {
      case "verifying":
        return <Loader2 className="h-12 w-12 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const renderStatusMessage = () => {
    switch (verificationStatus) {
      case "verifying":
        return "Verificando seu token...";
      case "success":
        return "Verificação bem-sucedida! Redirecionando...";
      case "error":
        return "Falha na verificação. Token inválido ou expirado.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Verificação de Token</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {renderStatusIcon()}
          <p className="mt-4 text-center">{renderStatusMessage()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
