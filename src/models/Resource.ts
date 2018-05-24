import {Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {Policy} from "./Policy";


@Entity()
@Index(['type', 'id'], {unique:true})
export class Resource {

    @PrimaryColumn()
    id: string

    @Column()
    type: string

    @OneToOne(type => Resource, null, {  nullable: true })
    @JoinColumn()
    parent: Resource

    @OneToOne(type => Policy, binding => binding.resource)
    policy: Policy

}