import Codes  from "../models/Codes";
import code_events from "../models/code_events";
import { Types } from "mongoose";


export const createCode = async (req, res, next) => {
    try{
        const { code,initial,expiry,comment,visitorSim,visitorName,source :{user,platform, id}} =  await req.body;

        const newCode = new Codes({code,initial,expiry,comment,visitorSim,visitorName,
            source: {user,platform,id }});
        const codeSaved = await newCode.save();
        
        if(codeSaved) {
            global._io.emit('newCode',{'msg':'event triggered'})
            res.status(200).json(codeSaved);
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
                {$limit: 20},
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
        res.status(200).json(codes);
    }else{
        res.status(201).json({'Error':'userId missing '});
    }
}


export const getCodeById = async (req,res) => {
    const code = await Codes.findById(req.params.codeId);
    res.status(200).json(code);
}

export const getVisitors_dashboard = async (req,res) => {
    try{
        // get all codes
        const codes = await Codes.aggregate([
            {
                $lookup:{
                        from : 'users',
                        localField : "source.user",
                        foreignField : '_id',
                        as :  'code_users'
                        }
                },
                {'$unwind' : '$code_users'},
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

        // get count code_events
        const  countEvents= await code_events.find().count();

        // get count codes
        const  countCodes = await Codes.find().count();

        const data = {'codes' : codes,
                    'countCodes' : countCodes,
                    'countEvents' :  countEvents}

        res.status(200).json(data);

    }catch(e){
        res.status(500).json({'error': 'error at getVisitors_dashboard: ' + JSON.stringify(e)})
    }

    
}


export const updateCodeById = async (req,res) => {
    const updatedCode = await Codes.findByIdAndUpdate(req.params.codeId,req.body,{new:true});
    res.status(200).json(updatedCode);    
}

export const deleteCodeById = async (req,res) => {
    const deletedCode = await Codes.findByIdAndDelete(req.params.codeId);
    res.status(204).json(deletedCode)
}

export const expirationCode = async (req,res) => {
    let now = await new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let code = await Codes.find({
        code: req.params.code,
        enable: 1,
        expiry: { $gte: now.toISOString()}
      });

      if(code.length > 0){
        res.status(200).json({'valid': true});
      }else{
        res.status(500).json({'valid':false});
      }
    
}