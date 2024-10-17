import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateUserDto } from './dto/updateUser.dto';

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

  async sendMagicLink(email: string): Promise<string> {
    const token = this.jwtService.sign({ email }, { expiresIn: '10m' });
    const magicLink = `${this.configService.get('BACKEND_URL')}/auth/verify?token=${token}`;
    await this.resend.emails.send({
      from: this.configService.get('EMAIL_FROM'),
      to: email,
      subject: 'Link para acessar sua conta',
      html: `
      <body
  style="
    background-color: #d4d2db;
    margin: 0;
    padding: 0;
    font-family: 'Rubik', Arial, Helvetica, sans-serif;
  "
>
  <table cellpadding="0" cellspacing="0" style="width: 320px; margin: 0 auto">
    <tr>
      <td align="center" style="padding: 30px 0">
        <img
          src="https://567cd3cf1e.imgdist.com/pub/bfra/itkamqar/9bl/ldx/g7x/logoipsum-297.png"
          alt="Company Logo"
          style="max-width: 120px"
        />
      </td>
    </tr>
    <tr>
      <td
        style="
          background-color: #ffffff;
          border-radius: 9px;
          padding: 50px 20px;
        "
      >
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <img
                src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/7631/password_reset.png"
                alt="Password"
                style="max-width: 100px; margin-bottom: 20px"
              />
              <h1 style="color: #101010; font-size: 18px">
                Seu link mágico chegou!
              </h1>
              <p style="color: #848484; font-size: 12px; margin: 0">
                Toque no botão abaixo para entrar na sua conta
              </p>
              <a
                href="${magicLink}"
                target="_blank"
                style="
                  background-color: #101;
                  color: #ffffff;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 9px;
                  display: inline-block;
                  margin-top: 30px;
                  margin-bottom: 10px;
                "
                >Fazer login</a
              >
              <p style="color: #848484; font-size: 12px; margin-bottom: 10px">
                ⏰ Tempo de expiração 24h.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0">
        <a
          href="https://www.instagram.com"
          target="_blank"
          style="display: inline-block; margin: 0 5px"
        >
          <img
            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-default-black/instagram@2x.png"
            width="32"
            alt="Instagram"
          />
        </a>
        <a
          href="https://www.whatsapp.com"
          target="_blank"
          style="display: inline-block; margin: 0 5px"
        >
          <img
            src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-default-black/whatsapp@2x.png"
            width="32"
            alt="WhatsApp"
          />
        </a>
      </td>
    </tr>
  </table>
</body>
`,
    });
    return token;
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

  async getUserProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Adicione outros campos que deseja retornar
      },
    });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: updateUserDto.name },
    });
  }
}
