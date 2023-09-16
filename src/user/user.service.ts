import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { UserDto } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: UserDto) {
    const user = new this.userModel(createUserDto);
    await this.isEmailUnique(user.email);
    await user.save();
    return {
      user: {
        email: user.email,
        _id: user._id,
      },
    };
  }

  async login(loginUserDto: UserDto) {
    const user = await this.findUserByEmail(loginUserDto.email);

    await this.checkPassword(loginUserDto.password, user);
    return {
      jwt: await this.authService.createAccessToken(user._id),
    };
  }

  async findUser(
    id: string,
  ): Promise<{ user: { id: string; email: string } } | null> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return null;
    }

    return {
      user: {
        id: user._id,
        email: user.email,
      },
    };
  }

  private async checkPassword(attemptPass: string, user) {
    const match = await bcrypt.compare(attemptPass, user.password);
    if (!match) {
      throw new NotFoundException('Wrong email or password.');
    }
    return match;
  }

  private async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email: email })
      .select('+password');
    if (!user) {
      throw new UnauthorizedException('Wrong email or password.');
    }
    return user;
  }

  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new ConflictException('Email must be unique.');
    }
  }
}
