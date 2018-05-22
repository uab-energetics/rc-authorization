import express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as amqplib from 'amqplib'

import {config, env, initEnvironment} from "node-laravel-config";
import {loadConfigurationSettings} from "./config";
import {createRabbitMQConnection} from "./amqplib-pubsub";

/* LOAD ENVIRONMENT VALUES */
dotenv.config({ path: ".env" });
initEnvironment(process.env)
loadConfigurationSettings()

/* CONNECT TO RABBITMQ */
export const rabbit$ = createRabbitMQConnection(amqplib, {
    host: config('rabbitHost'),
    user: config('rabbitUser'),
    pass: config('rabbitPass'),
} as any)

// rabbit$.then( ({ channel }) => registerListener(channel) )

/* BOOTSTRAP THE APP */
const app = express()
app.set('port', env('PORT', 5000))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export { app }
