import {PubSubEvent, PubSubMessage, rabbitmqObservable} from "./lib/amqplib-pubsub";
import {Subject} from "rxjs/Subject";
import {tap} from "rxjs/operators";


export const RESOURCE_CREATED_TOPIC = 'resource.created'

export const resourceCreatedObservable$ = new Subject<PubSubMessage>()