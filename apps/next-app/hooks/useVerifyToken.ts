import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type VerificationStatus = "verifying" | "success" | "error";

export function useVerifyToken() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("verifying");
  const router = useRouter();

  const verifyToken = useCallback(
    async (token: string) => {
      try {
        const response = await fetch(`http://localhost:3001/auth/verify?token=${token}`);

        if (response.ok) {
          setTimeout(() => setVerificationStatus("success"), 3000);
          localStorage.setItem("authToken", token);
          setTimeout(() => router.push("/"), 6000);
        } else {
          setVerificationStatus("error");
        }
      } catch (error) {
        setVerificationStatus("error");
      }
    },
    [router]
  );

  return { verificationStatus, verifyToken };
}
