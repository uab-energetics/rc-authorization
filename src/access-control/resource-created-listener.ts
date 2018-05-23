import * as Joi from 'joi'
import * as lodash from 'lodash'
import { PubSubMessage } from "../lib/amqplib-pubsub";
import { Subject } from "rxjs/Subject";
import { createResourcePolicy } from "./resource-policy-maker";
import { filter, map, tap } from 'rxjs/operators';

const resourceCreatedSchema = {
    resourceType: Joi.string(),
    resourceID: Joi.string().required(),
    parentType: Joi.any().optional(),
    parentID: Joi.string().optional(),
    ownerID: Joi.any().optional()
}


export const RESOURCE_CREATED_TOPIC = 'resource.created'

export interface ResourceCreatedPayload {
    parentType?: string
    parentID?: any
    resourceType: string
    resourceID: any
    ownerID?: any
}

export const resourceCreatedObservable$ = new Subject<PubSubMessage<ResourceCreatedPayload>>()

resourceCreatedObservable$
    .pipe(
        tap(console.log),
        map(msg => {
            // sanitizer function
            msg.data.resourceID = "" + msg.data.resourceID

            // handle nulls
            msg.data = lodash.pickBy(msg.data, lodash.identity)

            // parentID
            if(msg.data.parentID) msg.data.parentID = "" + msg.data.parentID

            return msg
        }),
        tap( msg => console.log('after sanitizing', msg.data)),
        filter(msg => {
            let { error } = Joi.validate(msg.data, resourceCreatedSchema)
            if (error) {
                console.log('Received "resource.created" event with invalid schema', error.details)
                return false
            }
            return true
        })
    )
    .subscribe(
        msg => createResourcePolicy(msg.data),
        err => console.log(err)
    )
