import jwt from "jsonwebtoken";
import Users from '../models/Users';
import Roles from "../models/Roles";
import node from "@babel/register/lib/node";
import { Mongoose } from "mongoose";

export const verifyToken = async (req,res, next) =>{
    console.log('\r\n---------------  Verify token   ---------------------');

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
    console.log('---------------  Is Admin   ---------------------')
    console.log('isAdmin params --> ', req.params)
    try{
        const user = await Users.findById(req.params.userId);
        const roles = await Roles.find({_id:{$in: user.roles}});
        
        for(let i=0; i < roles.length; i++ ){
            if(roles[i].name === 'admin'){
                next();
                return res.status(200);
            }
        console.log('is Not isAdmin  --> ');
        return res.status(400).json({'message':"Is Not admin"});
            
        }
    }catch(err){
        return res.status(400).json({'msg':"Require admin role"});
    }

}

export const isNeighbor = async(req, res, next) => {
    let founduser;
    console.log('userId --> ', req.params.userId);

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
                console.log('Neighbor is locked --> ');
                return res.status(200).json({'status':'200','msg':'Locked'});
            }else{
                console.log('Neighbor active --> ');
                next();
                return res.status(200).json({'status':'200','msg':'Neighbor active'});
            }

        }else{

            const found_roles = await Roles.find({_id:{$in: founduser.roles}});
            if(!found_roles) return res.status(400).json({'error':'roles not found for user'})
            console.log('isNeighbor role found --> ',found_roles);
            let neighbor_role = found_roles.find(el => el.name == 'neighbor');

                if(neighbor_role){
                    await next();
                    // return res.status(200).json({'msg':'Si es Neighbor'});
                }else{
                    console.log('is Not isNeighbor  --> ');
                    return res.status(400).json({'message':"Is Not a neighbor"});
                }
        }

        

    }catch(err){
        console.log('Error catch isNeighbor  --> ', err);
        res.status(400).json({'message':"Require neighbor role"});
    }
    
}