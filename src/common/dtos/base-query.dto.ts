import { IsNotEmpty, IsNumber } from 'class-validator';

export class BaseQueryDto {
    @IsNotEmpty({ message: 'page不能为空' })
    @IsNumber()
    page: number;

    @IsNotEmpty({ message: 'pageSize不能为空' })
    @IsNumber()
    pageSize: number;
}
