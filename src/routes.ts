import express from 'express'
import * as AuthService from "./AuthService";
import {resourceKey} from "./access-control/resource-policy-maker";
import {entityExists} from "./validation/validators";
import {Identity} from "./models/Identity";
import {Resource} from "./models/Resource";
import {Permission} from "./models/Permission";


export const router = express.Router()

let logBody = (req, res, next) => {
    console.log(req.body)
    next()
}

let concatResID = (req, res, next) => {
    req.body.resource_id = resourceKey(req.body.resource_type, req.body.resource_id)
    next()
}

router.post('/check',
    concatResID,
    entityExists('identity_id', 'user_id', Identity),
    entityExists('resource_id', 'id', Resource),
    entityExists('permission', 'name', Permission),
    (req, res) => {
        // resource_id is the type and the client id
        let {identity_id, resource_id, permission} = req.body

        AuthService.isAuthorized(identity_id, resource_id, permission)
            .then( authorized => {
                if (authorized === false) {
                    res.status(401).json({status: 'UNAUTHORIZED'})
                }
                res.status(200).json({status: 'AUTHORIZED'})
            } )

    }
)