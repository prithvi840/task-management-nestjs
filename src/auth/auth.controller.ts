import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialDto: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredDto: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredDto);
  }
}
