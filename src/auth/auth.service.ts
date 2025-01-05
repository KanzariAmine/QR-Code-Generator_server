import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
const userCredential = {
  id: 1,
  email: 'kanpower@gmail.tn',
  password: '50200797',
};
export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(email: string, pass: string) {
    if (email !== userCredential.email || pass !== userCredential.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: userCredential.id, email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
