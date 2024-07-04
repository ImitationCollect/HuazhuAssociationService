export const JWT_CONSTANTS = {
    SECRET: 'hzaServiceJWT', // 密钥
    EXPIRESIN: '86400s', // token有效时间 24h
    EXPIRESIN_NUMBER: 86400
};

// 1[手机验证码] 2[手机号+密码] 3[微信]
export enum AUTH_TYPE_ENUM {
    PHONE_CODE = 1,
    USERNAME_PWD = 2
}

export const REQUEST_USER_KEY = 'user';
