import Roles from '../models/Roles';
import { Types } from 'mongoose';

export const createRoles = async (req, res) => {

}

export const getRoles = async (req,res) => {

    try{
        const roles = await Roles.find().sort({name:1});
        res.status(201).json(roles);
    }catch(err){
        res.status(502).json({'Error':'Error getting roles, '
         + err})
    }
      
}

export const getRolesNeiAdmin = async (req,res) => {

    try{
        const roles = await Roles.find({level:{ $in: [3,4]}}).sort({level:1});
        res.status(201).json(roles);
    }catch(err){
        res.status(502).json({'Error':'Error getting roles, '
         + err})
    }
      
}