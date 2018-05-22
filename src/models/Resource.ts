import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {Policy} from "./Policy";


@Entity()
export class Resource {

    @PrimaryColumn()
    id: string

    @Column('text')
    type: string

    @OneToOne(type => Resource, null, {  nullable: true })
    @JoinColumn()
    parent: Resource

    @OneToOne(type => Policy)
    policy: Policy

}