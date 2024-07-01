import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

export default [UserService, AuthService, JwtService];
