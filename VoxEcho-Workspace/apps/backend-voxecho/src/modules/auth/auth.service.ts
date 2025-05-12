import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private jwtService: JwtService) {}

  // validateUser using UsersService to find user by username
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null; // if user not found

    if (typeof user !== 'object' || !('password' in user)) {
      throw new UnauthorizedException('Invalid user data');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Exclude password from user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // sign token
  async signToken(user: { id: number; username: string }) {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }
}
