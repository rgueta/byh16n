import Users  from "../models/Users";
import {Types} from 'mongoose';
import { response } from "express";
import { Resiliencehub } from "aws-sdk";

export const createUser = async (req,res) =>{
    console.log('Create User -->', req.body);
    const roles = req.body.roles.map(Types.ObjectId);
    const pwd = await Users.encryptPassword(req.body.pwd)
    console.log('User encrypted pwd --> ', pwd)


    try{
        const  {name,email,username,house,uuid,sim,gender,
            avatar,core,location} = await req.body;

        const foundUser = await Users.findOne({email : req.body.email});
        if(!foundUser){
            const newUser = new Users({name,email,username,house,uuid,sim,gender,
                avatar,roles,pwd,core,location});

            const userSaved = await newUser.save();

            res.status(200).send({'status' : 200,'msg' : 'User saved'});
        }else{
            console.log('User already exists -> ' + JSON.stringify(foundUser));
            res.status(200).send({'status' : 201, 'msg' : 'User already exists'});
        }
            
        
    }catch(err){
        return res.status(401).send({'status' : 401, 'msg':err.message});
    }
}

export const RegisterUser = async (req, res) => {
    console.log('RegisterUser -->', req.body);
}

export const getUsers = async (req, res) =>{
    const users = await Users.find();
    res.json(users)
}

export const getUserById = async (req,res) => {
    const user = await Users.findById(req.params.userId);
    console.log(req.params.userId);
    res.status(200).json(user);
}

export const getUserByCore = async(req, res) =>{

    const query = {'core' : Types.ObjectId(req.params.coreId)};
    const fields = {};
    const mySort = await { 'house' : 1};

    try{

        const result = await Users.aggregate([
            {
                $match : {
                    core : Types.ObjectId(req.params.coreId)
                }
            },
            {$sort : { house : 1 }},
            {
                $lookup:{
                    'from' : 'roles',
                    'localField' : 'roles',
                    'foreignField' : '_id',
                    'as' : 'roles_user'
                }
            },
            {
                $project: {
                    core : 1,
                    email : 1,
                    gender : 1, 
                    house : 1,
                    location : 1,
                    locked : 1,
                    name : 1 ,
                    open : 1,
                    roles: '$roles_user.name',
                    sim : 1,
                    username : 1,
                    uuid : 1
                }
            }
        ]);
        
        if(result.length > 0){
            return res.status(200).json(result);
        }else{
            return res.status(300).json({'msg':'NO data found'});
        }
    }catch(ex){
        return res.status(501).json(ex);
    }
}

export const updateUserById = async (req,res) => {
    const updatedUser = await Codes.findByIdAndUpdate(req.params.userId,req.body,{new:true});
    res.status(200).json(updatedCode);    
}

export const deleteUserById = async (req,res) => {
    const deletedUser = await Codes.findByIdAndDelete(req.params.userId);
    res.status(204).json(deletedUser)
}

export const lockUser = async (req,res) =>{
    console.log('neighbor  to lock--> ', req.body.neighborId);

    const userId = Types.ObjectId(req.body.neighborId);
    try{
        const updLocked = await Users.updateOne({_id : userId},{$set:{locked:true}})
        if(updLocked)
            res.status(200).json({'msg': updLocked})
        else
        res.status(400).json({'msg': 'Can not locked user [ ' + 
        userId + ' ]'})
    }catch(err){
        res.status(400).json({'msg': err})
    }
    
}

export const unlockUser = async (req,res) =>{
    const userId = req.body.neighborId;
    try{
        const updUnlocked = await Users.updateOne({_id : Types.ObjectId(userId)},{$set:{locked:false}})
        if(updUnlocked)
            res.status(200).json({'msg': updUnlocked})
        else
            res.status(400).json({'msg': 'Can not unlocked user [ ' + 
            userId + ' ]'})
    }catch(err){
        res.status(400).json({'msg': err})
    }
}

export const getFamily = async (req,res) => {

    const user = await Users.findById(req.params.userId);
    if (user) {
        try{
            await Users.aggregate([
                {
                    $match: { 
                        house : user.house, 
                        core: Types.ObjectId(user.core),
                        _id: {$ne : Types.ObjectId(user._id)}
                    }
                },
                {
                    $project : { 
                        name: 1,
                        sim: 1 
                    }
                }
            ], async function(err, result){
    
                if(err || result == '') return res.status(301).json({'ErrMsg':"Usuarios no encontrados","Error": err});
                return res.status(200).json(result);
            });
        }catch(ex){
            res.status(301).json({'error':ex});
    
        }

    }else{
        res.status(301).json({'msg':'El usario no se encuentra'});
    }

}