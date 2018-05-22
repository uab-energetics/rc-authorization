import {Entity, PrimaryColumn} from "typeorm";


@Entity()
export class Resource {

    @PrimaryColumn()
    id: string

}