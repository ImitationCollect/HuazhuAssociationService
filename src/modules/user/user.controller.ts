import { Controller, Get, Response } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getHello(): string {
        return this.userService.getHello();
    }

    @Get('list')
    getUsers(): any {
        return this.userService.getUsers();
    }
}
