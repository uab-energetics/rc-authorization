import {getRepository} from "typeorm";
import {Identity} from "../models/Identity";


export let entityExists = (id, column_name, classRef) =>
    (request, response, next) => {
        getRepository(classRef)
            .findOneOrFail({ [column_name]: request.body[id] })
            .then( _ => next() )
            .catch( err => {
                response.status(404).json({status: `${classRef.name.toUpperCase()}_NOT_FOUND`})
            })
    }