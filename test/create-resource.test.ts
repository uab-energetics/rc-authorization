import {rabbitmqPublish, rabbitmqSubscribe} from "../src/lib/amqplib-pubsub";
import {RESOURCE_CREATED_TOPIC, resourceCreatedObservable$, ResourceCreatedPayload} from "../src/resource-listener";
import {tap} from "rxjs/operators";
import {loadConfigurationSettings} from "../src/config";
import {database$} from "../src/app";
import {createResourcePolicy, resourceKey} from "../src/policies/create-resource-policy";
import {getConnection} from "typeorm";
import {Resource} from "../src/models/Resource";

/* TESTING DATA */
let type = 'project'
let id = '1234'
let dummyResourceEvent: ResourceCreatedPayload = {
    resourceType: type,
    resourceID: id
}


beforeEach(() =>
    database$)

afterEach(() =>
    getConnection().getRepository(Resource)
        .delete(resourceKey(type, id)));

test('RabbitMQ Subscription Test Case', () =>
    createResourcePolicy(dummyResourceEvent)
        .then( result => console.log(result) )
        .catch( err => console.error(err) ))