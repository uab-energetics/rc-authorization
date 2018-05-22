import {ResourceCreatedPayload} from "../resource-listener";
import {getConnection} from "typeorm";
import {Resource} from "../models/Resource";
import {Policy} from "../models/Policy";
import {Identity} from "../models/Identity";

export let resourceKey = (type: string, id) => `${type}:${id}`

export let createResourcePolicy = (event: ResourceCreatedPayload) => {
    let conn = getConnection()

    let resRepo = conn.getRepository(Resource)
    let policyRepo = conn.getRepository(Policy)
    let identityRepo = conn.getRepository(Identity)

    // create the Resource
    let resource = resRepo.create({
        id: resourceKey(event.resourceType, event.resourceID),
        type: event.resourceType
    })

    // TODO - set the parent ID

    // TODO - create the default policy

    // TODO - union/inherit the parent policy

    return resRepo.insert(resource)
}