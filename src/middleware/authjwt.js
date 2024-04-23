import jwt from "jsonwebtoken";
import Users from '../models/Users';
import Roles from "../models/Roles";
import node from "@babel/register/lib/node";
import { Mongoose } from "mongoose";

export const verifyToken = async (req,res, next) =>{

    try{
        let token = req.header("authorization");
        console.log('token--> ', token);

        if(!token || typeof token === 'undefined' || token === '') 
        {
            console.log('verify Token no se detecta token -->', token )
            return res.status(400).json({'msg':'Not token provided'})
        }

        token = await token.replace('Bearer ','');
        await jwt.verify(token, process.env.SECRET,(async (err, decoded) => {
            if(err){
                return res.status(401).json({'verify token error ': err.message});
            }else{
                //--- Decode, Dates Access token
                // res.status(201).json({'msg':'verify token Ok '});
                // res.status(201);
                next();
            }
        }));
        
    }catch(e){
        return res.status(400).json({'Verify token error':e});
    }
    
};

export const isAdmin = async(req, res, next) => {
    try{
        const user = await Users.findById(req.params.userId);
        const roles = await Roles.find({_id:{$in: user.roles}});

        const Rolefound = roles.find(role => role.name == 'admin');
        
        if(Rolefound){
            next();
        }else{
            res.status(400).json({'message':"Is Not admin"});
        }

    }catch(err){
        return res.status(400).json({'msg':"Require admin role"});
    }

}

export const isNeighborAdmin = async(req, res, next) => {
    try{
        const user = await Users.findById(req.params.userId);
        const roles = await Roles.find({_id:{$in: user.roles}});
        
        const Rolefound = roles.find(role => role.name == 'neighborAdmin');

        if (Rolefound){
            next();
            // res.status(200);
        }else{
            res.status(400).json({'message':"Is Not neighborAdmin"});
        }
    }catch(err){
        return res.status(400).json({'msg':"Require neighborAdmin role"});
    }

}

export const isNeighbor = async(req, res, next) => {
    let founduser;

    // VERify if user exists
    if(req.params.userId){
        founduser = await Users.findById(req.params.userId);
    }
    else if(req.params.email){
        founduser = await Users.findOne({email:req.params.email});
    }
    
    try{
        // user NOT FOUND  -----------------
        if(req.params.userId){
            if(!founduser) return res.status(400).json({'error':'isNeighbor user not found'});
        }else if(req.params.email){
            if(!founduser) return res.status(405).json({'status':'405','msg':'email not found'});
        }

        // user FOUND -----------------
        if(req.params.email){  //verifying for PwdRST  -------------------

            if(founduser.locked){ // Verifying user is locked
                return res.status(200).json({'status':'200','msg':'Locked'});
            }else{
                next();
                return res.status(200).json({'status':'200','msg':'Neighbor active'});
            }

        }else{

            const found_roles = await Roles.find({_id:{$in: founduser.roles}});
            if(!found_roles) return res.status(400).json({'error':'roles not found for user'})

            let neighbor_role = found_roles.find(el => el.name == 'neighbor' ||  el.name == 'neighborAdmin');

                if(neighbor_role){
                    await next();
                    // return res.status(200).json({'msg':'Si es Neighbor'});
                }else{
                    console.log('is Not isNeighbor  --> ');
                    return res.status(400).json({'message':"Is Not a neighbor"});
                }
        }

        

    }catch(err){
        res.status(400).json({'message':"Require neighbor role"});
    }
    
}