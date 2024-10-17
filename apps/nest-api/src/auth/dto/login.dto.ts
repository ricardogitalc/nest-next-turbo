import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    { message: 'Digite um email válido, por exemplo: email@gmail.com.' },
  )
  @IsNotEmpty({
    message: 'O email é obrigatório.',
  })
  email: string;
}
