import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Utils } from '@/utils/utils';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'varchar', length: 200, comment: '用户名称', nullable: true })
    userName: string;

    @Column({ type: 'varchar', length: 11, comment: '手机号' })
    @Unique(['phoneNumber'])
    phoneNumber: string;

    @Column({ type: 'varchar', length: 18, comment: '身份证号', nullable: true })
    @Unique(['IDNumber'])
    IDNumber: string;

    @Column({ type: 'int', comment: '鉴权类型:1[手机验证码] 2[手机号+密码] 3[微信]', nullable: true })
    authType: number;

    @CreateDateColumn({ comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ comment: '更新时间' })
    updateTime: Date;

    @Column({ type: 'varchar', comment: '密码' })
    @Exclude()
    password: string;

    // 将创建时间转成字符串返回
    @Expose({ name: 'createTime' })
    getCreateTime() {
        return Utils.dateFormat(this.createTime);
    }

    @Expose({ name: 'updateTime' })
    getUpdateTime() {
        return Utils.dateFormat(this.updateTime);
    }
}
