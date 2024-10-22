"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoginButton from "./(auth)/LoginButton";
import LogoIcon from "./Icons/LogoIcon";
import { ModeToggle } from "./ModeToggle";
import { UserButton } from "./UserButton";

function getUserData() {
  return typeof window !== "undefined" ? window.__USER_DATA__ : null;
}

export function NavBar() {
  const [userData, setUserData] = useState<Window["__USER_DATA__"]>(null);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  return (
    <nav className="bg-background border-b border-border flex justify-between items-center p-5 w-full">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <LogoIcon />
        </Link>
        <div className="flex items-center space-x-4">
          {userData?.isLoggedIn ? <UserButton /> : <LoginButton />}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
