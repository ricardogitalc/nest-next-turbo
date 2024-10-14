"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Save, User } from "lucide-react";
import { useState } from "react";

interface UserData {
  name: string;
  email: string;
}

function ProfileForm({ initialData }: { initialData: UserData }) {
  const [userData, setUserData] = useState<UserData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementará a lógica para salvar os dados do usuário
    console.log("Dados a serem salvos:", userData);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Perfil do Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="flex">
              <User className="w-4 h-4 mr-2 mt-3" />
              <Input id="name" name="name" value={userData.name} onChange={handleChange} placeholder="Seu nome" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex">
              <Mail className="w-4 h-4 mr-2 mt-3" />
              <Input
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                type="email"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
