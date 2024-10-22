import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.sendMagicLink(loginDto.email);
    return { message: 'Magic link enviado com sucesso', token };
  }

  @Post('verify')
  async validateToken(@Body('token') token: string) {
    try {
      const user = await this.authService.verifyMagicLink(token);
      const jwt = this.authService.generateToken(user);
      return { valid: true, jwt };
    } catch (error) {
      return { valid: false, message: 'Token inválido ou expirado' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('logged')
  async isLoggedIn(
    @Request() request: Request & { cookies: { [key: string]: string } },
  ) {
    const token = request.cookies['jwt'];
    if (!token) return { isLoggedIn: false };
    const isValid = await this.authService.verifyJwtToken(token);
    return { isLoggedIn: isValid };
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logout realizado com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    return this.authService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    return this.authService.updateUser(userId, updateUserDto);
  }
}
