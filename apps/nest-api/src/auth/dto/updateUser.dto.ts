import { IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(\s[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/, {
    message: 'Digite um nome e sobrenome, sem números ou caracteres especiais.',
  })
  name?: string;
}
