"use client";

import { useVerifyToken } from "@/hooks/useVerifyToken";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const { verificationStatus, verifyToken } = useVerifyToken();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token")?.toString();

    if (token) {
      verifyToken(token);
    }
  }, [searchParams, verifyToken]);

  const renderStatusIcon = () => {
    switch (verificationStatus) {
      case "verifying":
        return <Loader2 className="h-9 w-9 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-9 w-9 text-green-500" />;
      case "error":
        return <XCircle className="h-9 w-12 text-red-500" />;
    }
  };

  const renderStatusMessage = () => {
    switch (verificationStatus) {
      case "verifying":
        return "Verificando seu token...";
      case "success":
        return "Verificação concluída.";
      case "error":
        return "Falha na verificação,";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="w-[350px] border p-4 py-6 rounded-lg">
        <div className="flex items-center justify-center gap-4">
          {renderStatusIcon()}
          <h1 className="text-center text-xl">{renderStatusMessage()}</h1>
        </div>
      </div>
    </div>
  );
}
