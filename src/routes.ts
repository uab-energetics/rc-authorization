import express from 'express'
import * as AuthService from "./AuthService";


export const router = express.Router()


router.post('/check', (req, res) => {
    let identityPromise = AuthService.findIdentity(req.body.identity_id)
        .then(identity => {
            if (!identity)
                res.status(404).json({status: 'IDENTITY_NOT_FOUND'})
            return identity
        })
    let resourcePromise = AuthService.findResource(req.body.resource_type, req.body.resource_id)
        .then(resource => {
            if (!resource)
                res.status(404).json({status: 'RESOURCE_NOT_FOUND'})
            return resource
        })
    let permissionPromise = AuthService.findPermission(req.body.permission)
        .then(permission => {
            if (!permission)
                res.status(404).json({status: 'PERMISSION_NOT_FOUND'})
            return permission
        })

    Promise.all([identityPromise, resourcePromise, permissionPromise])
        .then( ([identity, resource, permission]) => {
            AuthService.isAuthorized(identity, resource, permission)
                .then( authorized => {
                    if (authorized === false) {
                        res.status(401).json({status: 'UNAUTHORIZED'})
                    }
                    res.status(200).send()
                } )
        })
        .catch( err => res.status(500).json(err))

})