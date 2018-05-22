import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn} from "typeorm";
import {Resource} from "./Resource";
import {Binding} from "./Binding";


@Entity()
export class Policy {

    @PrimaryColumn()
    id: string

    @OneToOne(type => Resource)
    @JoinColumn()
    resource: Resource

    @OneToMany(type => Binding, binding => binding.policy)
    bindings: Binding[]
}