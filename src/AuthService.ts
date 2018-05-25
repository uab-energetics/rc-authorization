import {Resource} from "./models/Resource";
import {getRepository} from "typeorm";

export let isAuthorized =  async (user_id: string, resource_id: string, permission_name: string): Promise<boolean> => {
    let resourceQuery = getRepository(Resource).createQueryBuilder("resource")
        .where("resource.id = :resource_id", {resource_id: resource_id})
        .innerJoin("resource.policy", "policy")
        .innerJoin("policy.bindings", "binding")
        .innerJoin("binding.members", "member", "member.user_id = :member_id", {member_id: user_id})
        .innerJoin("binding.role", "role")
        .innerJoin("role.permissions", "permission", "permission.name = :permission_name", {permission_name: permission_name})
    let count = await resourceQuery.getCount()
    return count > 0
}