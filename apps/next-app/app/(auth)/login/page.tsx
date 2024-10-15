import LoginForm from "@/components/(auth)/LoginForm";
import GoogleButton from "@/components/GoogleButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="flex items-start justify-center min-h-screen bg-background-foreground pt-20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
          <CardDescription>Escolha seu método preferido.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <Separator className="my-5" />
          <GoogleButton />
        </CardContent>
      </Card>
    </div>
  );
}
