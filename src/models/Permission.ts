import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "./Role";


@Entity()
export class Permission {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    name: string

    @ManyToMany(type => Role, role => role.permissions)
    roles: Role[]

}