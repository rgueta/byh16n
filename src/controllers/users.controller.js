import Users  from "../models/Users";
import {Types} from 'mongoose';
import { response } from "express";

export const createUser = async (req,res) =>{
    console.log('Create rUser -->', req.body);

    try{
        const  {name,email,username,house,uuid,sim,gender,avatar,pwd,core} = await req.body;
        const roles = req.body.roles.map(Types.ObjectId);

        const foundUser = await Users.findOne({email : req.body.email})
        if(!foundUser){
            // const newUser = new Users({name,email,username,house,uuid,sim,gender,avatar,pwd,core,roles});

            // const userSaved = await newUser.save();

            res.status(200).send({'status' : 200,'msg' : 'User saved'});
        }else{
            console.log('User already exists -> ' + JSON.stringify(foundUser));
            res.status(200).send({'status' : 201, 'msg' : 'User already exists'});
        }
    }catch(err){
        return res.status(200).send({'status' : 401, 'msg':err.message});
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
    Users.find({'core' : Types.ObjectId(req.params.coreId)}, (err,result) => {
        if(err){
            console.log(err);
            res.status(500).json(err);
        }else{
            res.status(200).json(result);
        }
    });

}

export const updateUserById = async (req,res) => {
    const updatedUser = await Codes.findByIdAndUpdate(req.params.userId,req.body,{new:true});
    res.status(200).json(updatedCode);    
}

export const deleteUserById = async (req,res) => {
    const deletedUser = await Codes.findByIdAndDelete(req.params.userId);
    res.status(204).json(deletedUser)
}