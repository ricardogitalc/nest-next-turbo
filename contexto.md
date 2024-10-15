# intruções de respostas

- responder sempre na linguagem português brasileiro
- seguir etapas passo a passo
- seguir sempre a ordem lógica para implementar as funcionalidades

# objetivo da aplicação

- criar um site full stack parecido com freepik onde terá varios templates para o usuario pode baixar e usar.

# tecnologias e frameworks

- turborepo para criar um projeto monorepo com dois projetos, um para o front-end e outro para o back-end.
- para o front-end; next js, react, typescript, tailwindcss, shadcn-ui para componentes, lucid para icones, zod, react-hook-form e etc...
- para o back-end; nest js, JWT, typescript, prisma ORM com sqlite, resend para envio de emails, class validator e etc...

# links de referência

nextjs: https://nextjs.org/docs
nestjs: https://docs.nestjs.com/

# portas

- backend: http://localhost:3001
- frontend: http://localhost:3000

# schema prisma

datasource db {
provider = "sqlite"
url = env("DATABASE_URL")
}

generator client {
provider = "prisma-client-js"
}

model User {
id Int @id @default(autoincrement())
email String @unique
name String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

# features do site

- página de login com magic link (usuário recebe um email com um token jwt) e com conta google.
- caso o usuário não exista, uma conta é criada no banco de dados usando prisma e mongoDB e no caso de usuário existente, é feito o login e o token jwt é armazenado no localStorage.
- esse token é usado para acessar as rotas protegidas.
- uma página para exibir e editar os dados do usuário como nome, sobrenome, email e etc...

# O que já foi feito

- Turborepo configurado com nest-api (backend) e next-app (frontend).
- Prisma configurado com SQLite e PrismaService implementado no backend.

Backend (NestJS):

- Implementação do AuthService para geração e verificação de magic links.
- Configuração do JWT para geração de tokens.
- Endpoint para envio de magic link (/auth/login).
- Endpoint para verificação de token (/auth/verify).
- Integração com Resend para envio de emails.
- Configuração de CORS para permitir requisições do frontend.
- Criação do JwtAuthGuard para proteger rotas.
- Implementação do endpoint /auth/profile para obter dados do usuário autenticado.
- Configuração do JwtStrategy para autenticação JWT.
- Criação do arquivo constants.ts para armazenar a chave secreta do JWT.
- Atualização do AuthModule para incluir as dependências necessárias (PrismaModule, ConfigModule, JwtModule).

Frontend (Next.js):

- Página de login com formulário para solicitar magic link.
- Componente LoginForm com lógica de envio de magic link.
- Página de verificação de token (/auth/verify).
- Implementação de toast notifications para feedback ao usuário.
- Estilização usando shadcn/ui e Lucide icons.

Fluxo de autenticação:

- Envio de magic link implementado.
- Verificação de token no backend.
- Criação de usuário no banco de dados, se não existir.
- Armazenamento do token JWT no localStorage após verificação bem-sucedida.

# Features a serem adicionadas
