import {config} from "node-laravel-config";
import {seedDatabase} from "./_seeder";
import {Permission} from "../../models/Permission";

const permissions = [
    {
        name: 'create-projects'
    },
    {
        name: 'invite-users'
    },
    {
        name: 'pub-repos-admin'
    }
]

seedDatabase("Setup Permissions", async connection => {
    let permissionsRepo = connection.getRepository(Permission)
    permissions.forEach( async permission => {
        if( await permissionsRepo.findOne({ name: permission.name }) )
            return
        permissionsRepo.insert(permission)
    })
})