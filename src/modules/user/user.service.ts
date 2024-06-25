import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './user.entity';
import { PageService } from '../services';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createUser(params) {
        return this.userRepository.insert(params);
    }

    async editUser(params) {
        this.userRepository.update(params.userId, params);
        return { message: '更新成功' };
    }

    async getUserList(params) {
        const pageService = new PageService(this.userRepository);
        const result = await pageService.paginate({
            ...params,
            querySqlOptions: {
                order: { updateTime: 'DESC' }
            },
            likeKeys: ['userName', 'phoneNumber', 'createTime', 'IDNumber']
        });
        return result;
    }

    async getUserDetail(params) {
        return this.userRepository.findOne({ where: params });
    }

    async deleteUser(id) {
        return this.userRepository.delete(id);
    }
}
