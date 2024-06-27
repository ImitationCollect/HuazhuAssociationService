import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PageService } from '../services';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createUser(params) {
        const find = await this.getUserDetail({ phoneNumber: params?.phoneNumber });
        if (!find) {
            const createInfo = await this.userRepository.insert(params);
            return createInfo?.identifiers ? createInfo?.identifiers[0] : null;
        } else {
            throw new BadRequestException('该手机号已注册');
        }
    }

    async editUser(params) {
        const find = await this.getUserDetail({ userId: params?.userId });
        if (find) {
            await this.userRepository.update(params.userId, params);
            return this.getUserDetail({ userId: params?.userId });
        } else {
            throw new BadRequestException('userId不存在');
        }
    }

    async getUserList(params) {
        const pageService = new PageService(this.userRepository);
        const result = await pageService.paginate({
            ...params,
            querySqlOptions: {
                order: { updateTime: 'DESC' }
            },
            likeKeys: ['userName', 'phoneNumber', 'createTime', 'IDNumber', 'updateTime']
        });
        return result;
    }

    async getUserDetail(params) {
        return this.userRepository.findOne({ where: params });
    }

    async deleteUser(id) {
        const userIds = id.toString().split(',');
        await this.userRepository.delete(userIds);
        return null;
    }
}
