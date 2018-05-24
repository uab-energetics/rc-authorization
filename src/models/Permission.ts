import {Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "./Role";


@Entity()
export class Permission {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({unique: true})
    name: string

    @ManyToMany(type => Role, role => role.permissions)
    roles: Role[]

}