import {Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Binding} from "./Binding";


@Entity()
export class Identity {

    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    user_id: string

    @ManyToMany(type => Binding, binding => binding.members)
    bindings: Binding[]

}