import { useAuthStore } from "@/app/store/authStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function LogoutButton() {
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <DropdownMenuItem onSelect={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair</span>
    </DropdownMenuItem>
  );
}
