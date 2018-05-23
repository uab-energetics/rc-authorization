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
    await Promise.all(
        roles.map( async role => {
            let result = await rolesRepo.save(role)
            console.log("saved: ", role, result)
            return result
        })
    )
})