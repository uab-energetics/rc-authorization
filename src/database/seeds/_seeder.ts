const glob = require('glob')
import * as dotenv from 'dotenv'

import {entities as dbmodels} from "../entities";
import {createConnection} from "typeorm";

import * as configHeler from '../../config'
import {config, env, initEnvironment} from "node-laravel-config";

dotenv.config({ path: ".env" });
initEnvironment(process.env)
configHeler.loadConfigurationSettings()

let seeders = []

export let seedDatabase = (name: string, seedFunction) =>
    seeders.push({ name, seedFunction })

glob.sync(__dirname + '/*.seed.ts')
    .forEach( file => require(file) )

createConnection({
    type: "mysql",
    host: config('mysqlHost'),
    port: 3306,
    username: config('mysqlUser'),
    password: config('mysqlPass'),
    database: config('mysqlDB'),
    entities: dbmodels,
    synchronize: true,
    logging: false
}).then( async connection => {
    await Promise.all(
        seeders.map( async seeder => {
            await seeder.seedFunction(connection)
            console.log('Finished - ' + seeder.name)
        })
    )
    console.log('Done Seeding')
    process.exit(0)
}).catch( err => {
    console.log('Seeding Failed', err)
    process.exit(1)
})
