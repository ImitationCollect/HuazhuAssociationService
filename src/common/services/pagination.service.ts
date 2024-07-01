import { Like } from 'typeorm';

export class PaginationResult<T> {
    total: number;
    pageSize: number;
    page: number;
    totalPage: number;
    isEnd: boolean;
    list: T[];
}

// 分页查询
export class PaginationService<T> {
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
    async paginate(params: { page: number; pageSize: number; querySqlOptions?: any; likeKeys?: string[] }): Promise<PaginationResult<T>> {
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

        const paginationResult = new PaginationResult<T>();
        paginationResult.list = result;
        paginationResult.total = total;
        paginationResult.pageSize = pageSize;
        paginationResult.page = page;
        paginationResult.totalPage = Math.ceil(total / pageSize);
        paginationResult.isEnd = paginationResult.totalPage === page;

        return paginationResult;
    }
}
