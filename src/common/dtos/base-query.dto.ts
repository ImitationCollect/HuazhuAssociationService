import { IsNotEmpty, IsNumber } from 'class-validator';

export class BaseQueryDto {
    @IsNumber()
    @IsNotEmpty({ message: 'page不能为空' })
    page: number;

    @IsNumber()
    @IsNotEmpty({ message: 'pageSize不能为空' })
    pageSize: number;
}
