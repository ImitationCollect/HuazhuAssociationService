import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getHello(): string {
        return 'user Hello World!1111111111111';
    }
}
