import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Utils } from '../../utils/utils';
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
    @Exclude() // IDNumber不返回给客户端
    IDNumber;

    @CreateDateColumn({ comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ comment: '更新时间' })
    updateTime: Date;

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
