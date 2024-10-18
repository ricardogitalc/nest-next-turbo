import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function LogoutButton() {
  return (
    <DropdownMenuItem>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair</span>
    </DropdownMenuItem>
  );
}
