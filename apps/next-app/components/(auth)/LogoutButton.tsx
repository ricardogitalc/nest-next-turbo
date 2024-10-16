import { useAuthStore } from "@/app/stores/authStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    const setIsLoggedIn = useAuthStore.getState().setIsLoggedIn;
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair</span>
    </DropdownMenuItem>
  );
}
