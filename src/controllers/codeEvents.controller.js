import code_events  from "../models/code_events";
import { Schema, Types } from "mongoose";
import { RegisterUser } from "./users.controller";

export const createCode_event = async (req,res) => {
    const codeId = Types.ObjectId(req.params.codeId);
    const picId = req.params.picId;
    const CoreSim = req.params.CoreSim;

    const newCode_event = new code_events({codeId,CoreSim,picId});
    const eventSaved = await newCode_event.save();

    res.status(201).json(eventSaved);
}

export const getCode_events = async (req,res) => {
    if(req.params.CoreSim != null){
        const CoreSim = req.params.CoreSim;
        const codeEvents = await code_events.aggregate([
            {
                $lookup:{
                        'from' :  'codes',
                        'localField' : 'codeId',
                        'foreignField' : '_id',
                        'as' : 'code_events_code'
                    }
            },
            {$unwind : '$code_events_code'},
                {
                $lookup:{
                        'from' :  'visitors',
                        'localField' : 'code_events_code.visitorId',
                        'foreignField' : '_id',
                        'as' : 'code_visitors'
                    }
                },
            {$unwind : '$code_visitors'},
            {
                $lookup : {
                        'from' :  'users',
                        'localField' : 'code_events_code.source.user',
                        'foreignField' : '_id',
                        'as' : 'codes_users'
                    }   
                },
            {$unwind : '$codes_users'},
            {
                $match : {
                        coreSim : req.params.CoreSim
                    }
                },
            {$sort : { createdAt : -1 }},
            {
                $project : {
                        codeId : 1,
                        CoreSim : 1,
                        code : '$code_events_code.code',
                        casa : '$codes_users.house',
                        visitorname : '$code_visitors.name',
                        createdAt : { 
                            $dateToString: { 
                              format: '%Y/%m/%d %H:%M:%S', 
                              date: '$createdAt', 
                              timezone: 'America/Los_Angeles' 
                            } 
                          }
                    }
            }
        ]);

        res.status(201).json(codeEvents);
    }else{
        res.status(401).json({'msg':'core_sim parameter not received'})
    }
}
export const getCode_eventsByDate = async (req,res) => {
    console.log('getCode_eventsByDate --> start ' , new Date(req.params.start));
    
    if(req.params.CoreSim != null && req.params.start != null && req.params.end != null){
        const CoreSim = req.params.CoreSim;
        const date = req.params.date;

        const codeEvents = await code_events.aggregate([
            {
                $lookup:{
                        'from' :  'codes',
                        'localField' : 'codeId',
                        'foreignField' : '_id',
                        'as' : 'code_events_code'
                    }
            },
            {$unwind : '$code_events_code'},
                {
                $lookup:{
                        'from' :  'visitors',
                        'localField' : 'code_events_code.visitorId',
                        'foreignField' : '_id',
                        'as' : 'code_visitors'
                    }
                },
            {$unwind : '$code_visitors'},
            {
                $lookup : {
                        'from' :  'users',
                        'localField' : 'code_events_code.source.user',
                        'foreignField' : '_id',
                        'as' : 'codes_users'
                    }   
                },
            {$unwind : '$codes_users'},
            {
                $match : {
                        'code_events_code.source.user'  : Types.ObjectId(req.params.userId),
                        createdAt :  {
                            $gt : new Date(req.params.start),
                            $lt : new Date(req.params.end)
                        }
                    }
                },
            {$sort : { createdAt : -1 }},
            {
                $project : {
                        codeId : 1,
                        coreSim : 1,
                        code : '$code_events_code.code',
                        casa : '$codes_users.house',
                        visitorname : '$code_visitors.name',
                        createdAt : { 
                            $dateToString: { 
                                format: '%Y/%m/%d %H:%M:%S', 
                                date: '$createdAt', 
                                timezone: 'America/Los_Angeles' 
                            } 
                            }
                    }
            }
    ]);
    if(codeEvents){
        res.status(201).json(codeEvents);
    }else{
        res.status(204).json({'msg':'No data found'})
    }
    }
}
