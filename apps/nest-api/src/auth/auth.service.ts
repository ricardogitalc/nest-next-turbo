import { Injectable } from '@nestjs/common';
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
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({ data: { email } });
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '15m' },
    );
    const magicLink = `${this.configService.get('FRONTEND_URL')}/auth/verify?token=${token}`;

    await this.resend.emails.send({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Seu Magic Link de Login',
      html: `<p>Clique <a href="${magicLink}">aqui</a> para fazer login.</p>`,
    });
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
