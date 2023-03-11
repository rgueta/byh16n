import jwt from "jsonwebtoken";
import Users from '../models/Users';
import Roles from "../models/Roles";

export const verifyToken = async (req,res, next) =>{
    console.log('\r\n---------------  Verify token   ---------------------');

    try{
        let token = req.header("authorization");
        console.log('token--> ', token);

        if(!token || typeof token === 'undefined' || token === '') 
        {
            console.log('verifyToken no se detecta token -->', token )
            return res.status(400).json({message:'Not token provided'})
        }

        token = await token.replace('Bearer ','');
        await jwt.verify(token, process.env.SECRET,(async (err, decoded) => {
            if(err){
                return res.status(401).json({'verify token error ': err.message});
            }else{
                //--- Decode, Dates Access token
                return res.status(201).json({'msg':'verify token Ok '});
            }
        }));
        
    }catch(e){
        return res.status(400).json({'Verify token error':e});
    }
    
};

export const isAdmin = async(req, res, next) => {
    console.log('isAdmin params --> ', req.params)
    const user = await Users.findById(req.params.userId);
    const roles = await Roles.find({_id:{$in: user.roles}});
    console.log('Roles --> ',roles);
    for(let i=0; i < roles.length; i++ ){
        if(roles[i].name === 'admin'){
            next();
            return;
        }
        
    }

    return res.status(403).json({message:"Require admin role"});
}

export const isNeighbor = async(req, res, next) => {
    console.log('isNeighbor req.params', req.params);
    const founduser = await Users.findById(req.params.userId);
    try{
        if(!founduser) return res.status(400).json({'error':'isNeighbor user not found'})
        const found_roles = await Roles.find({_id:{$in: founduser.roles}});
        if(!found_roles) return res.status(400).json({'error':'roles not found for user'})
        console.log('isNeighbor role found --> ',found_roles);
        for(let i=0; i < found_roles.length; i++ ){
            if(found_roles[i].name === 'neighbor'){
                return res.status(200).json({'message':"Is neighbor, Ok"});
            }
        }
        return res.status(400).json({'message':"Is Not a neighbor"});

    }catch(err){
        return res.status(400).json({'message':"Require neighbor role"});
    }
    
    
    
}