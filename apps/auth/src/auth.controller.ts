import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './decorators/user.decorator';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UsersService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @AuthUser() user: UserDto, 
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@AuthUser() user: UserDto) {
    return user;
  }
}
