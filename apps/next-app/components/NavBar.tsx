"use client";

import Link from "next/link";
import LogoIcon from "./Icons/LogoIcon";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { UserButton } from "./UserButton";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-background-primary">
      <Link href="/" className="flex items-center space-x-2">
        <LogoIcon />
      </Link>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <Link href="/login" className="flex items-center space-x-2">
          <Button variant="outline" className="bg-blue-600 text-white">
            Login
          </Button>
        </Link>
        <UserButton />
      </div>
    </nav>
  );
}
