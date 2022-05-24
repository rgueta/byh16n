import Codes  from "../models/Codes";
import { Types } from "mongoose";

export const createCode = async (req,res) => {
    console.log('createCode req body --> ',req.body);
    // return
    const { code,initial,expiry,comment,visitorId,source :{user,platform, id}} = req.body;
    // const parameters = req.body
    // console.log('parameters --> ',parameters.source.user);
    
    
    // const userId = Types.ObjectId(req.body.source.user);
    // const visitorId = Types.ObjectId(req.body.visitorId);
    // console.log('params --> ',userId,visitorId)
    // return
    const newCode = new Codes({code,initial,expiry,comment,visitorId,
        source: {user,platform,id }});
    const codeSaved = await newCode.save();
    
   
    // console.log(req.body);
    res.status(201).json(codeSaved);
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
                       visitorname: '$codes_visitors.name',
                       visitorsim: '$codes_visitors.sim'
                       }
               }
    ])
    res.json(codes);
}

export const getCodesByUser = async (req,res) => {
    console.log('get Code events');
    if(req.params.userId != 'null'){
        console.log('get Code by user: ' + req.params.userId);
        // const user = new ObjectId(req.params.userId);
        const codes = await Codes.aggregate([
            {$sort : {expiry : -1}},
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
                        visitorName: '$codes_visitors.name',
                        visitorSim: '$codes_visitors.sim'
                        }
                }
        ])


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