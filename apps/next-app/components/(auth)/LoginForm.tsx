"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  return (
    <form className="grid gap-4">
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="email@gmail.com" type="email" required />
        </div>
      </div>
      <Button className="w-full mt-4" type="submit">
        Enviar link mágico
      </Button>
    </form>
  );
}

export default LoginForm;
