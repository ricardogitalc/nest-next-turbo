"use client";

import { useAuthStore } from "@/app/store/authStore";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoginButton from "./(auth)/LoginButton";
import LogoIcon from "./Icons/LogoIcon";
import { ModeToggle } from "./ModeToggle";
import { UserButton } from "./UserButton";

export function NavBar() {
  const { isLoggedIn, checkAuthStatus } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };
    verifyAuth();
  }, [checkAuthStatus]);

  return (
    <nav className="bg-background border-b border-border flex justify-between items-center p-5 w-full">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <LogoIcon />
        </Link>
        <div className="flex items-center space-x-4">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isLoggedIn ? <UserButton /> : <LoginButton />}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
