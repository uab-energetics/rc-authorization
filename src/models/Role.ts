import {Column, Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Permission} from "./Permission";
import {Binding} from "./Binding";


@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    name: string

    @ManyToMany(type => Permission, permission => permission.roles)
    permissions: Permission[]

    @OneToMany(type => Binding, binding => binding.role)
    bindings: Binding[]
}