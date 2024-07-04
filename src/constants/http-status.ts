import { HttpStatus as NestHttpStatus } from '@nestjs/common';

export const HttpStatus = {
    ...NestHttpStatus,
    NO_PHONE_CODE_SENT: 10000 //未发送验证码
};
