import jwt from "jsonwebtoken";
import config from '../config';
import Users from '../models/Users';
import Roles from "../models/Roles";

// export const verifyToken = async (req,res, next) =>{
//     try{
//         const token = req.headers["x-access-token"];
//         console.log(token);

//         if(!token) return res.status(403).json({message:'Not token provided'})
//         const decoded = await jwt.verify(token,config.auth.SECRET,(err,decoded) => {
//             if(err){
//                 console.log(err);
//                 return res.status(401).json({message:'jwt verify',
//         'error': err.message});
           
//             }else{
//                 console.log('decoded: ' + decoded);
//             }
//         });
//         next();
//         req.userId = decoded.id;
        
//         const user = await Users.findById(req.userId,{pwd:0});
//         if(!user) return res.status(404).json({message:"no user found"});
//         console.log(decoded);
//         next();

//     }catch(e){
//         return res.status(401).json({message:'Unauthorized',
//         'error': e.message})
//     }
    
// };

// --- Original code  ---


export const verifyToken = async (req,res, next) =>{
    console.log('verifyToken req.headers --> ', req.headers);
    try{
        let token = req.header('Authorization');
        token = token.replace('Bearer ','');
        console.log('verifyToken header[Authorization] --> ', token);

        if(!token) return res.status(403).json({message:'Not token provided'})
        const decoded = jwt.verify(token,config.auth.SECRET);
        console.log('jwt.verify decoded: ' + JSON.stringify(decoded))
        // req.paramss.userId = decoded.id;
        
        console.log('findById req.params.userId --> ', req.params.userId);
        const user = await Users.findById(req.params.userId,{pwd:0});
        if(!user) return res.status(404).json({message:"no user found"});
        next();
        // return;

    }catch(e){
        console.log('verifyToken Error --> ', e.message)
        return res.status(401).json(e)

        // return res.status(401).json({message:'Unauthorized',
        // 'error': e.message})
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

    if(!founduser) return res.status(401).json({'error':'isNeighbor user not found'})
    const found_roles = await Roles.find({_id:{$in: founduser.roles}});
    if(!found_roles) return res.status(401).json({'error':'roles not found for user'})
    console.log('isNeighbor role found --> ',found_roles);
    for(let i=0; i < found_roles.length; i++ ){
        if(found_roles[i].name === 'neighbor'){
            next();
            return;
        }
    }

    return res.status(403).json({message:"Require neighbor role"});
    
}