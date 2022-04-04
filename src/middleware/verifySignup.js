import {ROLES} from "../models/Roles"; //- when have time get this roles from mongo
import Users from "../models/Users";

export const checkDuplicateUsernameEmail = async (req, res, next) => {
    const user = await Users.findOne({username : req.body.username});

    if (user) return res.status(400).json({message:'Username already exists'})

    const email = await Users.findOne({email: req.body.email});
    if(email) return res.status(400).json({message : 'Email already exists'})

    next();

}

export const checkRolesExists = (req,res,next) =>{
    if(req.body.roles){
        for(let i=0; i<req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                return res.status(400).json({
                    message: `Role ${req.body.roles[i]} does not exists`
                })
            }
        }
    }
    next();
}