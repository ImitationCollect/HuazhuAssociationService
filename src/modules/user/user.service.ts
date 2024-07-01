import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PaginationService } from '@/common/services/pagination.service';
import { validate } from '@/utils/validation/validate';
import { PhoneCodeRegisterDto, UsernameRegisterDto } from './user.dto';
import { HashingService } from '@/common/services/hashing.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    /**
     * 用户名密码创建用户
     * @param params
     * @returns
     */
    async createUser(params) {
        await validate(UsernameRegisterDto, params);

        const { phoneNumber, password } = params || {};
        const find = await this.userRepository.findOne({ where: { phoneNumber } });
        if (!find) {
            const hashingService = new HashingService();
            const hashedPassword = await hashingService.hash(password);
            return this.userRepository.save({ ...params, password: hashedPassword });
        } else {
            throw new BadRequestException('该手机号已注册');
        }
    }

    /**
     * 手机号 验证码 注册账户
     * @param params
     * @returns
     */
    async phoneCodeRegister(params) {
        await validate(PhoneCodeRegisterDto, params);
        const { phoneNumber } = params || {};
        const find = await this.userRepository.findOne({ where: { phoneNumber } });
        if (!find) {
            return this.userRepository.save(params);
        } else {
            throw new BadRequestException('该手机号已注册');
        }
    }

    /**
     * 编辑用户信息
     * @param params
     * @returns
     */
    async editUser(params) {
        const { userId } = params || {};
        const find = await this.getUserDetail({ userId });
        if (find) {
            await this.userRepository.update(params.userId, params);
            return this.getUserDetail({ userId });
        } else {
            throw new BadRequestException('userId不存在');
        }
    }

    /**
     * 分页查询用户列表
     * @param params
     * @returns
     */
    async getUserList(params) {
        const pageService = new PaginationService(this.userRepository);
        const result = await pageService.paginate({
            ...params,
            querySqlOptions: {
                order: { updateTime: 'DESC' }
            },
            likeKeys: ['userName', 'phoneNumber', 'createTime', 'IDNumber', 'updateTime']
        });
        return result;
    }

    /**
     * 根据id查询用户详情
     * @param params
     * @returns
     */
    async getUserDetail(params) {
        return this.userRepository.findOne({ where: params });
    }

    /**
     * 根据id删除用户
     * @param id
     * @returns
     */
    async deleteUser(id) {
        const userIds = id.toString().split(',');
        await this.userRepository.delete(userIds);
        return null;
    }
}
