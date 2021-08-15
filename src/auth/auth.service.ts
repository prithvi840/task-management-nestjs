import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UserRepository } from './users.repository';
import { IJwtPayload } from './jwt-payload.interface';
import { StringifyOptions } from 'querystring';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialsDTO): Promise<void> {
    try {
      await this.userRepository.createUser(authCredentialDto);
    } catch (code) {
      console.log('code: ', code);
      if (
        (Object.prototype.hasOwnProperty.call(this.userRepository.userErrors),
        code)
      )
        throw new ConflictException(
          this.userRepository.userErrors[code](authCredentialDto.username),
        );

      throw new InternalServerErrorException();
    }
  }

  async signIn(
    authCredDto: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { username } = authCredDto;
    const user: User | null = await this.userRepository.findOne({
      username,
    });

    if (user && (await bcrypt.compare(authCredDto.password, user.password))) {
      const payload: IJwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Please check your login credentials');
  }
}
