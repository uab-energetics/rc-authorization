import {PubSubMessage} from "./lib/amqplib-pubsub";
import {Subject} from "rxjs/Subject";


export const RESOURCE_CREATED_TOPIC = 'resource.created'

export interface ResourceCreatedPayload {
    parentType?: string
    parentID?: any
    resourceType: string
    resourceID: any
    ownerID?: any
}

export const resourceCreatedObservable$ = new Subject<PubSubMessage<ResourceCreatedPayload>>()
