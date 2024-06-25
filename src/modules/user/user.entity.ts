import { Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'varchar', length: 200, comment: '用户名称' })
    userName: string;

    @Column({ type: 'varchar', length: 11, comment: '手机号' })
    @Unique(['phoneNumber'])
    phoneNumber: string;

    @Column({ type: 'varchar', length: 18, comment: '身份证号' })
    @Unique(['IDNumber'])
    IDNumber;

    @CreateDateColumn({ comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ comment: '更新时间' })
    updateTime: Date;
}
