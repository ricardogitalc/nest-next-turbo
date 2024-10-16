import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    await this.authService.sendMagicLink(loginDto.email);
    return { message: 'Magic link enviado com sucesso' };
  }

  @Throttle({
    default: {
      limit: 1, // 1 Requisição
      ttl: 60000, // 1 minuto
    },
  }) // Definindo limite de requisições
  @Get('verify')
  async verify(
    @Query('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.verifyMagicLink(token);
    const jwt = this.authService.generateToken(user);
    response.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { message: 'Autenticação bem-sucedida' };
  }

  @Get('logged')
  async isLoggedIn(
    @Request() request: Request & { cookies: { [key: string]: string } },
  ) {
    const token = request.cookies['jwt'];
    if (!token) return { isLoggedIn: false };
    const isValid = await this.authService.verifyJwtToken(token);
    return { isLoggedIn: isValid };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logout realizado com sucesso' };
  }
}
