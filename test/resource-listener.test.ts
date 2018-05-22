import * as amqplib from 'amqplib'
import {createRabbitMQConnection, rabbitmqObservable, rabbitmqPublish} from "../src/amqplib-pubsub";
import {config} from "node-laravel-config/dist";
import {async} from "rxjs/scheduler/async";
import {RESOURCE_CREATED_TOPIC, resourceCreatedObservable$} from "../src/resource-listener";
import {tap} from "rxjs/operators";
import {loadConfigurationSettings} from "../src/config";

test('Example Test Case', (done) => {

    loadConfigurationSettings()

    createRabbitMQConnection(amqplib, {
        host: config('rabbitHost'),
        user: config('rabbitUser'),
        pass: config('rabbitPass'),
    } as any).then( ({channel}) => {

        rabbitmqObservable(channel, RESOURCE_CREATED_TOPIC)
            .pipe( tap(console.log) )
            .subscribe( msg => resourceCreatedObservable$.next(msg) )

        setTimeout(() => {
            // because RabbitMQ will drop fanout messages
            rabbitmqPublish(channel, { exchange: RESOURCE_CREATED_TOPIC, payload: { msg: 'hello!' } })
        }, 1000)

        resourceCreatedObservable$.subscribe( msg => {
            expect(msg).toBeTruthy()
            done()
        })

    })

})
