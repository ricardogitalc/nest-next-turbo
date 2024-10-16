import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendMagicLink(email: string): Promise<void> {
    const token = this.jwtService.sign({ email }, { expiresIn: '10m' });
    const magicLink = `${this.configService.get('BACKEND_URL')}/auth/verify?token=${token}`;
    await this.resend.emails.send({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Seu Magic Link de Login',
      html: `<p>Clique <a href="${magicLink}">aqui</a> para fazer login.</p>`,
    });
  }

  async verifyMagicLink(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const email = payload.email;
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await this.prisma.user.create({ data: { email } });
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  generateToken(user: any): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async verifyJwtToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      return false;
    }
  }
}
