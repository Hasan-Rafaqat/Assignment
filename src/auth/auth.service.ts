import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from 'src/user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createAccessToken(userId: string) {
    return sign({ userId }, 'abcdef');
  }

  async validateUser(jwtPayload: { userId: string }): Promise<any> {
    const user = await this.userModel.findOne({
      _id: jwtPayload.userId,
    });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  private jwtExtractor(request) {
    let token = null;
    if (request.headers.authorization) {
      token = request.headers.authorization
        .replace('Bearer ', '')
        .replace(' ', '');
    }

    return token;
  }

  returnJwtExtractor() {
    return this.jwtExtractor;
  }
}
