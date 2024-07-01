import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export function validate(payload: any, config: Record<string, unknown>) {
    const validateConfig: any = plainToInstance(payload, config, { enableImplicitConversion: true });
    const errors = validateSync(validateConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        const errorConstraints = errors.map(item => item.constraints);
        let message = '';
        errorConstraints.forEach(item => {
            Object.values(item).forEach(value => {
                message = message + `${value} `;
            });
        });

        throw new BadRequestException(message);
    }
    return validateConfig;
}
