
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    id: number

    @Column({
        type: 'varchar'
    })
    name: string

    @Column({
        type: 'varchar',
        unique: true
    })
    email: string

    @Column({
        type: 'varchar'
    })
    phone: string

    @Column({
        type: 'varchar'
    })
    address: string

    @Column({
        type: 'varchar'
    })
    password: string

    @Column({
        type: 'bigint',
        nullable: true
    })
    created_by: number

    @Column({
        type: 'bigint',
        nullable: true
    })
    updated_by: number

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @DeleteDateColumn()
    deleted_at: Date
}
