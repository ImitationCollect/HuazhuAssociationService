import { IsNotEmpty, IsNumber,IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;
}

export class EditUserDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsString()
    userName: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    IDNumber: string;
}

export class BaseQueryDto {
    @IsNotEmpty()
    @IsNumber()
    page: number;
  
    @IsNotEmpty()
    @IsNumber()
    pageSize: number;
  }

export class QueryUserDto  extends BaseQueryDto{
    userId: number;
    userName: string;
    phoneNumber: string;
    IDNumber: string;
    createTime: Date;
    updateTime: Date;
}
