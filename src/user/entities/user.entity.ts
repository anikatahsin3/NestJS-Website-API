
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {USER_CONSTANTS} from "../user.constants";

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
    designation: string

    @Column({
        type: 'varchar'
    })
    phone: string

    @Column({
        type: 'varchar'
    })
    address: string

    @Column({
        type: 'int',
        nullable: true,
    })
    employee_id: number


    //1 = admin, 2 = accountant, 3 = general user
    @Column({
        type: 'int',
        default: USER_CONSTANTS.USER_TYPE.USER
    })
    role: number

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
