import * as argon from 'argon2';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { SigninDto, SignupDto, SignupResponseDto, SigninResponseDto, ResponseMessageDto, RequestUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

  async signToken(userId: number, email: string): Promise<SigninResponseDto> {
    const payload = { sub: userId, email: email };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token, refresh_token: '' };
  }

  async getUserFromId(userId: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({ where: { id: userId } });
  }

  async signin(dto: SigninDto): Promise<SigninResponseDto | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Email or password is wrong');

    const isVerified = await argon.verify(user.password, dto.password);
    if (!isVerified) throw new ForbiddenException('Email or password is wrong');

    const response = await this.signToken(user.id, user.email);
    return response;
  }

  async signup(dto: SignupDto): Promise<SignupResponseDto | undefined> {
    const hash = await argon.hash(dto.password);
    try {
      const user: User = await this.prismaService.user.create({
        data: { email: dto.email, password: hash },
      });
      const response: SignupResponseDto = { id: user.id, email: user.email };
      return response;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
    }
  }

  async signout(user: RequestUserDto): Promise<ResponseMessageDto | undefined> {
    return { message: `Successfully signed out for ${user.email}.` };
  }
}
