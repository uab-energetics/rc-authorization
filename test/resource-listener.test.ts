import * as amqplib from 'amqplib'
import {createRabbitMQConnection, rabbitmqSubscribe, rabbitmqPublish} from "../src/lib/amqplib-pubsub";
import {config} from "node-laravel-config/dist";
import {RESOURCE_CREATED_TOPIC, resourceCreatedObservable$} from "../src/resource-listener";
import {tap} from "rxjs/operators";
import {loadConfigurationSettings} from "../src/config";

let ch

beforeEach(() => {
    return createRabbitMQConnection(amqplib, {
        host: config('rabbitHost'),
        user: config('rabbitUser'),
        pass: config('rabbitPass')
    } as any)
        .then( ({ channel }) => ch = channel )
        .catch( err => console.log('could not connect to rabbitmq. skipping test', err))
})


test('RabbitMQ Subscription Test Case', (done) => {

    loadConfigurationSettings()

    rabbitmqSubscribe(ch, RESOURCE_CREATED_TOPIC)
        .pipe( tap(console.log) )
        .subscribe( msg => resourceCreatedObservable$.next(msg) )

    setTimeout(() => {
        // because RabbitMQ will drop fanout messages
        rabbitmqPublish(ch, { exchange: RESOURCE_CREATED_TOPIC, payload: { msg: 'hello!' } })
    }, 1000)

    resourceCreatedObservable$.subscribe( msg => {
        expect(msg).toBeTruthy()
        done()
    })

})
