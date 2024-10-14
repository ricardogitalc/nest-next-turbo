import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UpdateProfileDto } from './dto/UpdateProfile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string) {
    await this.authService.sendMagicLink(email);
    return { message: 'Magic link enviado com sucesso' };
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    const user = await this.authService.verifyToken(token);
    if (user) {
      return { message: 'Token válido', user };
    } else {
      return { message: 'Token inválido' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(req.user.email, updateProfileDto);
  }
}
