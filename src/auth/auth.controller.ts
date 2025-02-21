import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() userInfo) {
    console.log('userInfo', userInfo);
    return this.authService.signIn(userInfo.email, userInfo.password);
  }
}
