import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

export interface PubSubEvent {
    exchange: string
    payload: object
}

export interface PubSubMessage<T> {
    data: T
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

    connection$.catch(console.error)

    let connection = await connection$
    let channel = await channel$
    return { connection, channel }
}

export const rabbitmqConnectionURI = ({host, user, pass, port = 5672}: ConnectionParams) => {
    let _auth = ''
    if (user) _auth = user + ':' + pass + '@'
    let _port = ''
    if (port) _port = ':' + port

    return `amqp://${_auth}${host}${_port}`
}

export const rabbitmqSubscribe = (rabbitChannel, exchange: string): Observable<PubSubMessage<any>> => {
    let subject = new Subject<PubSubMessage<any>>()

    rabbitChannel.assertExchange(exchange, 'fanout', {durable: false})
    rabbitChannel.assertQueue('', {exclusive: true}).then(q => {
        let handler = msg => {
            let decodedPayload = msg.content.toString()
            try {
                decodedPayload = JSON.parse(msg.content.toString())
                let acknowledgeFunc = () => rabbitChannel.ack(msg)
                subject.next({data: decodedPayload, ack: acknowledgeFunc})
            } catch (e) {
                console.warn('Warning: Could not parse JSON message: ', decodedPayload)
            }
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
