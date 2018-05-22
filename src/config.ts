import {env, initConfig} from "node-laravel-config";

export let loadConfigurationSettings = () =>
    initConfig({

        rabbitHost: env('RABBITMQ_HOST', 'localhost'),
        rabbitUser: env('RABBITMQ_USER', 'rabbitmq'),
        rabbitPass: env('RABBITMQ_PASS', 'rabbitmq'),

        mysqlHost: env('MYSQL_HOST', 'localhost'),
        mysqlDB: env('MYSQL_DB', 'rc-auth'),
        mysqlUser: env('MYSQL_USER', 'root'),
        mysqlPass: env('MYSQL_PASS', 'secret')

    })


loadConfigurationSettings()