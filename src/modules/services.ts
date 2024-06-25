import { UserService } from './user/user.service';
import { Repository, Like } from 'typeorm';

export class PageResult<T> {
    total: number;
    pageSize: number;
    page: number;
    totalPage: number;
    isEnd: boolean;
    list: T[];
}

// 分页查询
export class PageService<T> {
    constructor(private repository: any) {}

    /**
     *
     * @param page
     * @param pageSize
     * @param querySqlOptions 查询条件配置
     * @param likeKeys 需要模糊查询的字段名
     * @param other 客户端输入的查询字段内容
     * @returns
     */
    async paginate(params: { page: number; pageSize: number; querySqlOptions?: any; likeKeys?: string[] }): Promise<PageResult<T>> {
        const { page = 1, pageSize = 10, querySqlOptions = {}, likeKeys = [], ...other } = params;

        const queryFilter = Object.keys(other).map(item => {
            return {
                [item]: likeKeys.includes(item) ? Like(`%${other[item]}%`) : other[item]
            };
        });
        const [result, total] = await this.repository.findAndCount({
            ...querySqlOptions,
            take: pageSize,
            skip: pageSize * (page - 1),
            where: queryFilter
        });

        const pageResult = new PageResult<T>();
        pageResult.list = result;
        pageResult.total = total;
        pageResult.pageSize = pageSize;
        pageResult.page = page;
        pageResult.totalPage = Math.ceil(total / pageSize);
        pageResult.isEnd = pageResult.totalPage === page;

        return pageResult;
    }
}

export default [UserService, PageService];
