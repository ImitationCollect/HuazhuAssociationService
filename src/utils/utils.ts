import * as moment from 'moment';
import { DATE_TIME_FORMAT } from '@/constants';

export class Utils {
    /**
     * 时间格式化
     * @param obj 时间戳 | 时间
     * @param format 格式规范
     * @returns {string}
     */
    public static dateFormat(value, format = DATE_TIME_FORMAT): string {
        return moment(value).format(format);
    }

    /**
     * 获取时间戳
     * @param value
     * @param type [unix:秒，valueOf:毫秒]
     * @returns
     */
    public static getTimeStamp(value, type = 'unix'): number {
        if (this.isNull(value)) return;
        return type === 'unix' ? moment(value).unix() : moment(value).valueOf();
    }

    /**
     * 判断对象是否为空
     * @param obj String | Array | Object
     * @returns {boolean}
     */
    public static isNull(obj: any): boolean {
        if (obj == null) {
            return true;
        }
        if (typeof obj == undefined) {
            return true;
        }
        if (obj instanceof Array && obj.length == 0) {
            return true;
        }
        if (Object.prototype.toString.call(obj) == '[object String]' && obj == '') {
            return true;
        }
        return false;
    }
}
