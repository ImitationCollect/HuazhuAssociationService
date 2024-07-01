import { Controller, Get, Param, Body, Post, Delete, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, EditUserDto, QueryUserDto } from './user.dto';
import { AUTH_TYPE_ENUM } from '@/constants';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post('create')
    @ApiOperation({ summary: '创建用户' })
    createUser(@Body() createUserDto: CreateUserDto) {
        const { authType } = createUserDto || {};

        switch (authType) {
            case AUTH_TYPE_ENUM.PHONE_CODE:
                return this.userService.phoneCodeRegister(createUserDto);
            case AUTH_TYPE_ENUM.USERNAME_PWD:
                return this.userService.createUser(createUserDto);
            default:
                return this.userService.createUser(createUserDto);
        }
    }

    @Put('edit')
    @ApiOperation({ summary: '编辑用户' })
    editUser(@Body() editUserDto: EditUserDto) {
        return this.userService.editUser(editUserDto);
    }

    @Post('list')
    @ApiOperation({ summary: '查询用户列表' })
    getUserList(@Body() queryUserDto: QueryUserDto) {
        return this.userService.getUserList(queryUserDto);
    }

    @Get('detail/:userId')
    @ApiOperation({ summary: '查询用户详情' })
    getUserDetail(@Param('userId') userId: number | string) {
        return this.userService.getUserDetail({ userId });
    }

    @Delete('delete/:userId')
    @ApiOperation({ summary: '删除用户' })
    deleteUser(@Param('userId') userId: number | string) {
        return this.userService.deleteUser(userId);
    }
}
