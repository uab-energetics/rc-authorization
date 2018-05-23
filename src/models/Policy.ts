import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Resource} from "./Resource";
import {Binding} from "./Binding";


@Entity()
export class Policy {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(type => Resource)
    @JoinColumn()
    resource: Resource

    @OneToMany(type => Binding, binding => binding.policy)
    bindings: Binding[]
}