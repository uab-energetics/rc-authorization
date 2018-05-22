import {ResourceCreatedPayload} from "./resource-created-listener";
import {getConnection} from "typeorm";
import {Resource} from "../models/Resource";
import {Policy} from "../models/Policy";
import {Identity} from "../models/Identity";

export let resourceKey = (type: string, id) => `${type}:${id}`

export let resourcePolicyMaker = (event: ResourceCreatedPayload) => {
    let conn = getConnection()

    let resRepo = conn.getRepository(Resource)
    let policyRepo = conn.getRepository(Policy)
    let identityRepo = conn.getRepository(Identity)

    // create the Resource
    let resource = makeResource(resRepo, event)

    // TODO - set the parent ID

    // TODO - create the default policy

    // TODO - union/inherit the parent policy

    return resRepo.insert(resource)
}

let makePolicy = (repo, owner) => {}

let makeResource = (repo, {resourceType, resourceID}): Resource =>
    repo.create({
        id: resourceKey(resourceType, resourceID),
        type: resourceType
    })