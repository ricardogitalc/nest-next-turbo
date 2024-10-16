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

turboreppo: https://turbo.build/repo/docs
react: https://react.dev/learn
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
