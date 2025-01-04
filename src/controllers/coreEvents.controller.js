import coreEvents  from "../models/coreEvents";
import { Types } from "mongoose";

export const createCoreEvent = async (req,res) => {
    try{
        const core_Id = req.body.coreId;
        const coreId = Types.ObjectId(core_Id);

        console.log('req.body: ', req.body )

        newCoreEvent(coreId, req.body, res)

    }catch(err){
        res.status(501).json({'error: ': err})
    }
     
}

async function newCoreEvent(coreId,data,res){
    try{
        const newCoreEvent = 
            new coreEvents({coreId,data});
        const eventSaved = await newCoreEvent.save();
        await res.status(200).json(eventSaved);

        // await res.status(200).json({'msg': 'ok'})

    }catch(err){
        res.status(501).json({'error ': err})
    }
}

export const getCoreEvents = async (req,res) => {
    let codeEvents = ''
    let match = {}
    let start = ''
    let end = ''
    let match1 = {}

    if(req.body.CoreSim != null){
        match = { CoreSim : req.body.CoreSim } 
    }else{
        console.log('CoreSim is null: ', req.body.CoreSim )
        1 == 1;
    }

    if(req.params.start != null && req.params.end != null){
        console.log('start: ', start )
        console.log('end: ', end )

        console.log('req.params.start: ',req.params.start);
        console.log('req.params.end: ',req.params.end);
        
        start = await new Date(req.params.start);
        end = await new Date(req.params.end);

        await start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
        await end.setMinutes(end.getMinutes() - start.getTimezoneOffset());
   
        match1 = await {
            'codes.source.user'  : Types.ObjectId(req.params.userId),
            createdAt :  {
                $gte : new Date(start),
                $lte : new Date(end)
            }
        }

    }

    let query = [
                {
                    $match: match
                },
              
                {
                    $lookup:{
                            'from' :  'codes',
                            'localField' : 'codeId',
                            'foreignField' : '_id',
                            'as' : 'codes'
                        }
                },
                {$unwind : '$codes'},
                {
                    $lookup : {
                            'from' :  'users',
                            'localField' : 'codes.source.user',
                            'foreignField' : '_id',
                            'as' : 'users'
                        }   
                    },
                {$unwind : '$users'},
                {
                    $lookup : {
                            'from' :  'cores',
                            'localField' : 'users.core',
                            'foreignField' : '_id',
                            'as' : 'cores'
                        }   
                    },
                {$unwind : '$cores'},

                {
                    $match: match1
                },

                {$sort : { createdAt : -1 }},
                {
                    $project : {
                            codeId : 1,
                            CoreSim : 1,
                            code : '$codes.code',
                            street: '$cores.name',
                            doorName:1,
                            house : '$users.house',
                            visitorName : '$codes.visitorName',
                            initial: '$codes.initial',
                            expiry: '$codes.expiry',
                            createdAt : { 
                                $dateToString: { 
                                format: '%Y/%m/%d %H:%M:%S', 
                                date: '$createdAt', 
                                timezone: 'America/Los_Angeles' 
                                } 
                            }
                        }
                }
    ]
            
    try{
       codeEvents = await callQuery(query);
       if(codeEvents){
            res.status(201).send(codeEvents);
        }else{
            res.status(503).json({'msg':'No data found'})
        }
            
        
    }catch(err){
        console.log('Error: ', err);
        res.status(501).json({'error':err})
    }
}