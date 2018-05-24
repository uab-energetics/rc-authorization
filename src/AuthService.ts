import {Identity} from "./models/Identity";
import {Resource} from "./models/Resource";
import {Permission} from "./models/Permission";
import {createQueryBuilder, getRepository} from "typeorm";

export let isAuthorized =  async (identity: Identity, resource: Resource, permission: Permission): Promise<boolean> => {
    let resourceQuery = getRepository(Resource).createQueryBuilder("resource")
        .where("resource.id = :resource_id", {resource_id: resource.id})
        .innerJoin("resource.policy", "policy")
        .innerJoin("policy.bindings", "binding")
        .innerJoin("binding.members", "member", "member.id = :member_id", {member_id: identity.id})
        .innerJoin("binding.role", "role")
        .innerJoin("role.permissions", "permission", "permission.id = :permission_id", {permission_id: permission.id})
    let count = await resourceQuery.getCount()
    return count > 0
}

export let findIdentity = async(identity_id: string) => {
    return await getRepository(Identity)
        .findOne({ user_id: identity_id })
}

export let findResource = async(type: string, id: string) => {
    return await getRepository(Resource)
        .findOne({id: `${type}:${id}`})
}

export let findPermission = async(name: string) => {
    return await getRepository(Permission)
        .findOne({name: name})
}