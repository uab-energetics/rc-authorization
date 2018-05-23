import {ResourceCreatedPayload} from "./resource-created-listener";
import {getConnection} from "typeorm";
import {Resource} from "../models/Resource";
import {Policy} from "../models/Policy";
import {Identity} from "../models/Identity";
import {Role} from "../models/Role";
import {Binding} from "../models/Binding";

export let resourceKey = (type: string, id) => `${type}:${id}`

export let createResourcePolicy = async (event: ResourceCreatedPayload) => {
    let {resourceType, resourceID, parentType, parentID, ownerID } = event

    let conn = getConnection()

    let resRepo = conn.getRepository(Resource)
    let policyRepo = conn.getRepository(Policy)
    let identityRepo = conn.getRepository(Identity)
    let bindingRepo = conn.getRepository(Binding)

    const defaultRole = await conn.getRepository(Role).findOneOrFail({ name: 'owner' })

    // create the Resource
    let resource,
        parent,
        policy,
        binding,
        identity


    resource = resRepo.create({
        id: resourceKey(event.resourceType, event.resourceID),
        type: event.resourceType
    })

    policy = policyRepo.create({ resource: resource })

    try {
        await resRepo.save(resource)
        console.log('resource')
        await policyRepo.save(policy)
        console.log('policy')

        if(parentType)
            parent = await resRepo.findOneOrFail(resourceKey(parentType, parentID))

        if(ownerID) {
            identity = identityRepo.create({ user_id: ownerID })
            await identityRepo.save(identity)

            binding = bindingRepo.create({
                role: defaultRole,
                members: [ identity ],
                policy: policy
            })
            await bindingRepo.save(binding)
        }
    } catch (e) {
        console.log('error: ', e)
    }

}
