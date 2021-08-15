import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  userErrors = {
    23505: (value) => `User with username: ${value} already exists`,
  };

  async createUser(authCredentialDto: AuthCredentialsDTO): Promise<void> {
    const user = this.create({
      username: authCredentialDto.username,
      password: authCredentialDto.password,
    });

    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(user.password, salt);
    user.password = hashedPass;

    try {
      await this.save(user);
    } catch (error) {
      throw error.code;
    }
  }
}
