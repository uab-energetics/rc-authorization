import {Column, Entity, Index, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Binding} from "./Binding";


@Entity()
export class Identity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({unique: true})
    user_id: string

    @ManyToMany(type => Binding, binding => binding.members)
    bindings: Binding[]

}