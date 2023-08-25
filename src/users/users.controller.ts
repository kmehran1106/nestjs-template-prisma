import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: { email: string; id: number }) {
    return user;
  }
}