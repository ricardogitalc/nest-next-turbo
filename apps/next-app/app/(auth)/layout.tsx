import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
