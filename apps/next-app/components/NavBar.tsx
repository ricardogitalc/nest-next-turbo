"use client";

import Link from "next/link";
import LogoIcon from "./Icons/LogoIcon";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
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
          <Link href="/login" className="flex items-center space-x-2">
            <Button variant="default">Login</Button>
          </Link>
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
