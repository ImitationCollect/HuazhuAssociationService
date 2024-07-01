// 手机验证发
export class PhoneCodeService<T> {
    constructor() {}

    /**
     * @param phoneNumber
     * @returns {number}
     */
    async send(phoneNumber): Promise<number> {
        const code = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
        return Number(code);
    }
}
