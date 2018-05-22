import {config} from "node-laravel-config";
import {Role} from "../../models/Role";
import {seedDatabase} from "./_seeder";

const roles = [
    {
        name: 'owner'
    },
    {
        name: 'editor'
    },
    {
        name: 'viewer'
    }
]


seedDatabase("Setup Roles", async connection => {
    let rolesRepo = connection.getRepository(Role)
    roles.forEach( async role => {
        if( await rolesRepo.findOne({ name: role.name }) )
            return
        rolesRepo.insert(role)
    })
})