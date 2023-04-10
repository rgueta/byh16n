import Codes  from "../models/Codes";
import { Types } from "mongoose";
import { response } from "express";

export const createCode = async (req, res, next) => {
    try{
        const { code,initial,expiry,comment,visitorSim,visitorName,source :{user,platform, id}} =  await req.body;

        const newCode = new Codes({code,initial,expiry,comment,visitorSim,visitorName,
            source: {user,platform,id }});
        const codeSaved = await newCode.save();
        
        if(codeSaved) {
            res.status(200).json(codeSaved);
            // return next(codeSaved);
        }else{
            return res.status(304).json({'msg':'No created code'});
        }
        
    }catch(err){
        console.log('Error: ', err)
        res.status(304).json({'msg':'Not created code'});
    }

}

export const getCodes = async (req,res) => {

    const codes = await Codes.aggregate([
        {
            $lookup:{
                    from : 'users',
                    localField : "source.user",
                    foreignField : '_id',
                    as :  'code_users'
                    }
            },
            {
            $lookup:{
                    from : 'visitors',
                    localField : 'visitorId',
                    foreignField : '_id',
                    as :  'codes_visitors'
                    }
            },
            {'$unwind' : '$code_users'},
            {'$unwind' : '$codes_visitors'},
            {$sort : {expiry : -1}},
            {
               $project:{
                       codeId : 1,
                       code: 1,
                       created : 1,
                       initial : 1,
                       expiry : 1,
                       enable:1,
                       userId : '$code_users._id',
                       userName : '$code_users.name',
                       email : '$code_users.email',
                       avatar : '$code_users.Avatar',
                       visitorname: 1,
                       visitorSim: 1
                       }
               }
    ])
    res.json(codes);
}

export const getCodesByUser = async (req,res) => {
    if(req.params.userId != 'null'){
        console.log('get Code by user: ' + req.params.userId);
        // const user = new ObjectId(req.params.userId);
        const codes = await await Codes.aggregate([
            {$sort : {expiry : -1}},
            {
                $lookup:{
                        from : 'users',
                        localField : "source.user",
                        foreignField : '_id',
                        as :  'code_users'
                        }
                },
                {'$unwind' : '$code_users'},
                {
                    $match:{
                        'code_users._id' : { $eq : Types.ObjectId(req.params.userId)}
                    }
                },
                {
                $project:{
                        codeId : 1,
                        code: 1,
                        created : 1,
                        initial : 1,
                        expiry : 1,
                        enable:1,
                        userId : '$code_users._id',
                        userName : '$code_users.name',
                        email : '$code_users.email',
                        avatar : '$code_users.Avatar',
                        visitorSim: 1,
                        visitorName: 1,
                        sim: 1
                        }
                }
        ])

        await console.log('Codes --> ', codes);
        res.json(codes);
    }else{
        console.log({'Error':'userId missing '});
        res.status(201).json({'Error':'userId missing '});
    }
}


export const getCodeById = async (req,res) => {
    const code = await Codes.findById(req.params.codeId);
    console.log(req.params.codeId);
    res.status(200).json(code);
}

export const updateCodeById = async (req,res) => {
    console.log('(req.params.codeId --> ' + req.params.codeId);
    console.log('pkg to update --> ' + JSON.stringify(req.body))
    const updatedCode = await Codes.findByIdAndUpdate(req.params.codeId,req.body,{new:true});
    console.log('updatedCode -> ', updatedCode);
    res.status(200).json(updatedCode);    
}

export const deleteCodeById = async (req,res) => {
    const deletedCode = await Codes.findByIdAndDelete(req.params.codeId);
    res.status(204).json(deletedCode)
}