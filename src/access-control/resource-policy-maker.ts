import {ResourceCreatedPayload} from "./resource-created-listener";
import {getConnection} from "typeorm";
import {Resource} from "../models/Resource";
import {Policy} from "../models/Policy";
import {Identity} from "../models/Identity";

export let resourceKey = (type: string, id) => `${type}:${id}`

export let createResourcePolicy = (event: ResourceCreatedPayload) => {
    // if({})
    //     return console.log('received request to make resource policy')

    console.log('making resource', event)

    let conn = getConnection()

    let resRepo = conn.getRepository(Resource)
    let policyRepo = conn.getRepository(Policy)
    let identityRepo = conn.getRepository(Identity)

    // create the Resource
    let resource = makeResource(resRepo, event)
    console.log(resource)

    // TODO - set the parent ID
    // TODO - create the default policy
    // TODO - union/inherit the parent policy

    return resRepo.save(resource) // save() does an upsert
}

let makePolicy = (repo, owner) => {}

let makeResource = (repo, event): Resource => {
    console.log(event)
    return repo.create({
        id: resourceKey(event.resourceType, event.resourceID),
        type: event.resourceType
    })
}