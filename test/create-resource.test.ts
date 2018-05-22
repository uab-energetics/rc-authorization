import {rabbitmqPublish, rabbitmqSubscribe} from "../src/lib/amqplib-pubsub";
import {tap} from "rxjs/operators";
import {loadConfigurationSettings} from "../src/config";
import {database$} from "../src/app";
import {getConnection} from "typeorm";
import {Resource} from "../src/models/Resource";
import {resourceKey, resourcePolicyMaker} from "../src/access-control/resource-policy-maker";
import {ResourceCreatedPayload} from "../src/access-control/resource-created-listener";

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
    resourcePolicyMaker(dummyResourceEvent)
        .then(result => console.log(result))
        .catch(err => console.error(err)))