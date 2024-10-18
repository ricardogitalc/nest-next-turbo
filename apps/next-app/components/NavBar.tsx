"use client";

import Link from "next/link";
import LoginButton from "./(auth)/LoginButton";
import LogoIcon from "./Icons/LogoIcon";
import { ModeToggle } from "./ModeToggle";
import { UserButton } from "./UserButton";

export function NavBar() {
  return (
    <nav className="bg-background border-b border-border flex justify-between items-center p-5 w-full">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <LogoIcon />
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <UserButton />
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}
