import Link from "next/link";
import { Button } from "../ui/button";

function LoginButton() {
  return (
    <Link href="/login" className="flex items-center space-x-2">
      <Button variant="default">Login</Button>
    </Link>
  );
}

export default LoginButton;
