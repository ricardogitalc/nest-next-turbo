como mostrar ou ocultar componente no next baseado se está logado ou não

Claro! Vou mostrar como você pode mostrar ou ocultar componentes no Next.js baseado no estado de autenticação do usuário. Vamos criar um exemplo simples usando o App Router do Next.js.

Primeiro, vamos criar um componente que verifica o estado de autenticação e renderiza o conteúdo apropriado:

'use client'

import { useSession } from "next-auth/react"
import { ReactNode } from "react"

type AuthWrapperProps = {
children: ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
const { data: session, status } = useSession()

if (status === "loading") {
return <div>Carregando...</div>
}

if (status === "unauthenticated") {
return <div>Você precisa estar logado para ver este conteúdo.</div>
}

return <>{children}</>
}

Agora, vamos usar este componente em uma página:

import AuthWrapper from './components/AuthWrapper'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function Home() {
const session = await getServerSession(authOptions)

return (
<main className="flex min-h-screen flex-col items-center justify-between p-24">
<h1 className="text-4xl font-bold mb-8">Página Inicial</h1>

      {session ? (
        <AuthWrapper>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            Este conteúdo só é visível para usuários autenticados.
          </div>
        </AuthWrapper>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Você não está logado. Faça login para ver o conteúdo protegido.
        </div>
      )}
    </main>

)
}

Neste exemplo:

O componente AuthWrapper usa o hook useSession do NextAuth.js para verificar o estado de autenticação do usuário.
Na página principal (page.tsx), usamos getServerSession para verificar o estado de autenticação no servidor.
Dependendo do estado de autenticação, renderizamos diferentes conteúdos:

Se o usuário estiver autenticado, o conteúdo dentro de AuthWrapper será exibido.
Se o usuário não estiver autenticado, uma mensagem informando que é necessário fazer login será exibida.
O AuthWrapper também lida com o estado de carregamento, exibindo uma mensagem apropriada enquanto verifica o estado de autenticação.
Para usar este exemplo, você precisará configurar o NextAuth.js em seu projeto. Certifique-se de ter instalado o next-auth e configurado corretamente as opções de autenticação no arquivo [...nextauth]/route.ts dentro da pasta app/api/auth.

Este método permite que você controle facilmente a visibilidade dos componentes com base no estado de autenticação do usuário, tanto no lado do servidor quanto no lado do cliente.
