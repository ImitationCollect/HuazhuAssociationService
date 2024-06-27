import * as moment from 'moment';
import { dateTimeFormat } from '../constants';

export class Utils {
    /**
     * 时间格式化
     * @param obj 时间戳 | 时间
     * @param format 格式规范
     * @returns {string}
     */
    public static dateFormat(value, format = dateTimeFormat): string {
        return moment(value).format(format);
    }
}
