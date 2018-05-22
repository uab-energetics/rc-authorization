import express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as amqplib from 'amqplib'

import {config, env, initEnvironment} from "node-laravel-config";
import * as configHelper from "./config";
import {createRabbitMQConnection, rabbitmqSubscribe} from "./lib/amqplib-pubsub";
import {tap} from "rxjs/operators";
import {createConnection} from "typeorm";
import {entities as dbmodels} from "./database/entities";
import {RESOURCE_CREATED_TOPIC, resourceCreatedObservable$} from "./access-control/resource-created-listener";

/* LOAD ENVIRONMENT VALUES */
dotenv.config({ path: ".env" });
initEnvironment(process.env)
configHelper.loadConfigurationSettings()

/* BOOTSTRAP THE APP */
const app = express()
app.set('port', env('PORT', 5000))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/* CONNECT TO THE DB */
export const database$ = createConnection({
    type: "mysql",
    host: config('mysqlHost'),
    port: 3306,
    username: config('mysqlUser'),
    password: config('mysqlPass'),
    database: config('mysqlDB'),
    entities: dbmodels,
    synchronize: true,
    logging: false
})
database$
    .then( _ => app.emit('mysql-connected'))
    .catch( console.error )


/* CONNECT TO RABBITMQ */
export const rabbit$ = createRabbitMQConnection(amqplib, {
    host: config('rabbitHost'),
    user: config('rabbitUser'),
    pass: config('rabbitPass'),
})
rabbit$
    .then( _ => app.emit('rabbitmq-connected'))
    .catch( _ => app.emit('rabbitmq-failed'))

// publish resource.created events
rabbit$.then( ({ channel }) =>
    rabbitmqSubscribe(channel, RESOURCE_CREATED_TOPIC)
        .subscribe( msg => resourceCreatedObservable$.next(msg) ) )


app.on('mysql-connected', _ => console.log('connected to mysql'))
app.on('rabbitmq-connected', _ => console.log('connected to rabbitmq'))

export { app }
