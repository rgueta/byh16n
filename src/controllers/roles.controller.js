import Roles from '../models/Roles';
import { Types } from 'mongoose';

export const createRoles = async (req, res) => {

}

export const getRoles = async (req,res) => {

    try{
        const roles = await Roles.find();
        console.log(roles);
        res.status(201).json(roles);
    }catch(err){
        console.log('Error getting roles -> ',err)
        res.status(402).json({'Error':'Error getting roles, '
         + err})
    }
      
}