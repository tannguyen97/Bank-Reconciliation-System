import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService) {

  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
   
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userDto: UserDto, response: Response) {
    const payload = { sub: userDto.id, username: userDto.username }
    const token = this.jwtService.sign(payload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}
