import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Digite um email válido' })
  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  email: string;
}
