import {Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Policy} from "./Policy";
import {Role} from "./Role";
import {Identity} from "./Identity";


@Entity()
export class Binding {

    @PrimaryGeneratedColumn()
    id: string

    @ManyToOne(type => Policy, policy => policy.bindings)
    policy: Policy

    @ManyToOne(type => Role, role => role.bindings)
    role: Role

    @ManyToMany(type => Identity, identity => identity.bindings)
    members: Identity[]
}