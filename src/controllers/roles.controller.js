import Roles from '../models/Roles';
import { Types } from 'mongoose';

export const createRoles = async (req, res) => {

}

export const getRoles = async (req,res) => {
    const roles = await Roles.find();
    res.json(roles);
}