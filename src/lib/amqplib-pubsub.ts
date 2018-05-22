import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

export interface PubSubEvent {
    exchange: string
    payload: object
}

export interface PubSubMessage {
    data: object
    ack: Function
}

export interface ConnectionParams {
    host: string
    user?: string
    pass?: string
    port?: number
}

export const createRabbitMQConnection = async (amqp, params: ConnectionParams) => {
    let uri = rabbitmqConnectionURI(params)
    let connection$, channel$

    connection$ = amqp.connect(uri).then(conn =>
        channel$ = conn.createChannel())
    console.log('connecting on..', uri)

    let connection = await connection$
    let channel = await channel$
    return { connection, channel }
}

export const rabbitmqConnectionURI = ({host, user, pass, port = 5672}: ConnectionParams) => {
    let auth = ''
    if (user) auth = user + ':' + pass + '@'
    let _port = ''
    if (port) _port = ':' + port

    return `amqp://${auth}${host}${_port}`
}

export const rabbitmqObservable = (rabbitChannel, exchange: string): Observable<PubSubMessage> => {
    let subject = new Subject<PubSubMessage>()

    rabbitChannel.assertExchange(exchange, 'fanout', {durable: false})
    rabbitChannel.assertQueue('', {exclusive: true}).then(q => {
        let handler = msg => {
            let decodedPayload = JSON.parse(msg.content.toString())
            let acknowledgeFunc = () => rabbitChannel.ack(msg)
            subject.next({data: decodedPayload, ack: acknowledgeFunc})
        }

        rabbitChannel.bindQueue(q.queue, exchange, '')
        rabbitChannel.consume(q.queue, handler)
    }).catch(err => console.error(err))

    return subject.asObservable()
}

export const rabbitmqPublish = (rabbitChannel, {exchange, payload}: PubSubEvent) => {
    rabbitChannel.assertExchange(exchange, 'fanout', {durable: false})
    rabbitChannel.publish(exchange, '', new Buffer(JSON.stringify(payload)))
}
