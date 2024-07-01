import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// 无需auth校验的
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
