import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private resend: Resend;
  private pendingTokens: Map<string, string> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendMagicLink(email: string): Promise<void> {
    const token = this.jwtService.sign({ email }, { expiresIn: '15m' });
    this.pendingTokens.set(token, email);

    const magicLink = `${this.configService.get('FRONTEND_URL')}/verify?token=${token}`;

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
      const email = this.pendingTokens.get(token);

      if (email && email === payload.email) {
        this.pendingTokens.delete(token);
        let user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await this.prisma.user.create({
            data: { email, emailVerified: true },
          });
        } else if (!user.emailVerified) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true },
          });
        }

        return user;
      }
    } catch (error) {
      return null;
    }
  }
}
