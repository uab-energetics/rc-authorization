import * as Joi from 'joi'

import {PubSubMessage} from "../lib/amqplib-pubsub";
import {Subject} from "rxjs/Subject";
import {createResourcePolicy} from "./resource-policy-maker";
import {filter} from 'rxjs/operators';

const resourceCreatedSchema = {
    resourceType: Joi.string(),
    resourceID: Joi.string().required()
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
        filter( msg => {
            let {error} = Joi.validate(msg.data, resourceCreatedSchema)
            return error === null
        })
    )
    .subscribe(
        msg => createResourcePolicy(msg.data),
        err => console.log(err)
    )
