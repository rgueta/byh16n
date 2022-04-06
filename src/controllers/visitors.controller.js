import Visitors from "../models/visitors";
import { Types } from "mongoose";

export const createVisitor = async (req,res) =>{
    console.log('createVisitor --> ' + JSON.stringify(req.body))
    try{
        const  {userId, name,email,username,pwd,address,sim,gender,avatar} = req.body;
        
        const newVisitor = new Visitors({userId, name,email,username,pwd,address,sim,gender,avatar});
        console.log('newVisitor -> ',newVisitor);
        return;

        const visitorSaved = await newVisitor.save();

        // console.log('visitors --> ' + JSON.stringify(req.body));
    
        res.status(201).json({'visitorSaved':visitorSaved});
        // res.json('creating visistor')
    }catch(err){
        console.log(err);
        res.status(404).json(err)
    }
}

export const getVisitors = async (req, res) =>{
    const visitors = await Visitors.find();
    res.json(visitors)
}

export const getVisitorsByUser = async (req,res) => {
    console.log('get Visitors for user: ' + req.params.userId);
    const visitors = await Visitors.aggregate([
        {
            $match : {
                'userId' : {'$eq' : Types.ObjectId(req.params.userId)} 
            }
        },
        {
            $project : {
                _id : 1,
                name : 1,
                email : 1,
                username : 1,
                sim : 1,
                avatar : 1
                
                
            }
        }
    ])
    console.log('Visitors from userId' + req.params.userId);
    res.status(200).json(visitors);
}

export const getVisitorById = async (req,res) => {
    const visitor = await Visitors.findById(req.params.visitorId);
    console.log(req.params.visitorId);
    res.status(200).json(visitor);
}


export const updateVisitorById = async (req,res) => {
    const updatedVisitor = await Visitors.findByIdAndUpdate(req.params.visitorId,req.body,{new:true});
    res.status(200).json(updatedVisitor);    
}

export const updateSimpleVisitorById = async (req,res) => {
    console.log('updateSimpleVisitorById params -->', req.body) 
    await Visitors.findByIdAndUpdate(req.params.visitorId,req.body,{new:false},(err,result) =>{
        if(err) return res.status(401).json({'msg':'can not update visitor ' + err})
        console.log('updated Ok ' + result)
    });
    // if(!updatedVisitor) return res.status(401).json({'msg':'can not update visitor '}); 
    res.status(200).json(updatedVisitor);    
    // res.status(200).json({'msg':'testing'});
}


export const deleteVisitorById = async (req,res) => {
    const deletedVisitor = await Visitors.findByIdAndDelete(req.params.visitorId);
    res.status(204).json(deletedVisitor)
}