import express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as amqplib from 'amqplib'

import {config, env, initEnvironment} from "node-laravel-config";
import * as configHelper from "./config";
import {createRabbitMQConnection, rabbitmqObservable} from "./lib/amqplib-pubsub";
import {tap} from "rxjs/operators";
import {RESOURCE_CREATED_TOPIC, resourceCreatedObservable$} from "./resource-listener";

/* LOAD ENVIRONMENT VALUES */
dotenv.config({ path: ".env" });
initEnvironment(process.env)
configHelper.loadConfigurationSettings()

/* CONNECT TO RABBITMQ */
export const rabbit$ = createRabbitMQConnection(amqplib, {
    host: config('rabbitHost'),
    user: config('rabbitUser'),
    pass: config('rabbitPass'),
})

// publish resource.created events
rabbit$.then( ({ channel }) =>
    rabbitmqObservable(channel, RESOURCE_CREATED_TOPIC)
        .pipe( tap(console.log) )
        .subscribe( msg => resourceCreatedObservable$.next(msg) ) )


/* BOOTSTRAP THE APP */
const app = express()
app.set('port', env('PORT', 5000))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export { app }
