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

# o que já foi feito

- turborepo adicionado e configurado com nest-api para o backend e next-app para o front-end.
- prisma configurado, e o prisma service em nest-api.

- O magic link está sendo enviado e, se o usuário não existir, ele é criado no banco de dados. O token no link tem um tempo de expiração, garantindo segurança.

- Quando o usuário clica no link, o token é verificado pelo backend. No entanto, ainda não implementamos a lógica para armazenar o token no localStorage após a verificação bem-sucedida. Também não configuramos o uso desse token para autenticar o usuário em requisições subsequentes.

- Esses são os próximos passos lógicos para completar o fluxo de autenticação. Podemos implementar essas funcionalidades para finalizar o processo de autenticação com magic link.

# features a ser adicionada

- página de login com magic link (usuário recebe um email com um token jwt) e com conta google.
- caso o usuário não exista, uma conta é criada no banco de dados usando prisma e mongoDB e no caso de usuário existente, é feito o login e o token jwt é armazenado no localStorage.
- esse token é usado para acessar as rotas protegidas.
- uma página para exibir e editar os dados do usuário como nome, sobrenome, email e etc...
