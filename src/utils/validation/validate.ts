import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function validate(payload: any, config: Record<string, unknown>) {
    const validateConfig: any = plainToInstance(payload, config, { enableImplicitConversion: true });
    const errors = validateSync(validateConfig, { skipMissingProperties: false, stopAtFirstError: true, dismissDefaultMessages: false });

    if (errors.length > 0) {
        let message = Object.values(errors[0]?.constraints)[0]; // 只需要取第一个错误信息并返回即可

        throw new BadRequestException(message);
    }
    return validateConfig;
}
