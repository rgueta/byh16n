import code_events  from "../models/code_events";
import { Schema, Types } from "mongoose";

export const createCode_event = async (req,res) => {

    try{
        const code_Id = req.body.codeId;
        const picId = req.body.picId;
        const CoreSim = req.body.CoreSim;
        const codeId = Types.ObjectId(code_Id);
        console.log('at createCode_event parameters--> ' + codeId 
        + ', ' + picId 
        + ', ' + CoreSim )

        const newCode_event = new code_events({codeId,picId,CoreSim});
        const eventSaved = await newCode_event.save();
         // using global io from index.js
        global._io.emit('codeEvent',{'msg':'event triggered'})
        res.status(201).json(eventSaved);
        // res.status(201).json({'msg':'ok'})
    }catch(err){
        // console.log('createCode_event Error --> ', err)
        res.status(501).json({'msg..': err})
    }
    
    // try{
    //     const newCode_event = new code_events({codeId,CoreSim,picId});
    //     const eventSaved = await newCode_event.save();
    //     res.status(201).json(eventSaved);
    // }catch(err){
    //     console.log('Error --> ', err)
    //     res.status(504).json({'Error':e.message});
    // }    
}

export const createCode_event_ = async (req,res) => {
    const {code, picId, CoreSim} = await req.params;
    const codeId = Types.ObjectId(code);
    console.log('at createCode_event parameters--> ' + codeId 
    + ', ' + picId 
    + ', ' + CoreSim )
    try{
        const newCode_event = new code_events({codeId,CoreSim,picId});
        const eventSaved = await newCode_event.save();
        res.status(201).json(eventSaved);
    }catch(err){
        console.log('Error --> ', err)
        res.status(504).json({'Error':e.message});
    }    
}

export const getCode_events = async (req,res) => {
   

    if(req.params.CoreSim != null){
        const codeEvents = await code_events.aggregate([
            {
                $match : {
                        CoreSim : req.params.CoreSim
                    }
            },
            {
                $lookup:{
                        'from' :  'codes',
                        'localField' : 'codeId',
                        'foreignField' : '_id',
                        'as' : 'code_events_code'
                    }
            },
            {$unwind : '$code_events_code'},
            //     {
            //     $lookup:{
            //             'from' :  'visitors',
            //             'localField' : 'code_events_code.visitorId',
            //             'foreignField' : '_id',
            //             'as' : 'code_visitors'
            //         }
            //     },
            // {$unwind : '$code_visitors'},
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
                $lookup : {
                        'from' :  'cores',
                        'localField' : 'codes_users.core',
                        'foreignField' : '_id',
                        'as' : 'users_core'
                    }   
                },
            {$unwind : '$users_core'},
           
            {$sort : { createdAt : -1 }},
            {
                $project : {
                        codeId : 1,
                        CoreSim : 1,
                        code : '$code_events_code.code',
                        street: '$users_core.name',
                        house : '$codes_users.house',
                        visitorname : '$code_events_code.visitorName',
                        initial: '$code_events_code.initial',
                        expiry: '$code_events_code.expiry',
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
        res.status(501).json({'msg':'core_sim parameter not received'})
    }
}

export const getCode_eventsByDate = async (req,res) => {

    let start = await new Date(req.params.start);
    let end = await new Date(req.params.end);

    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    end.setMinutes(end.getMinutes() - start.getTimezoneOffset());


    if(req.params.CoreSim != null && req.params.start != null && req.params.end != null){
        const CoreSim = req.params.CoreSim;
        const date = req.params.date;

        const codeEvents = await code_events.aggregate([
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
                        'as' : 'codes_users'
                    }   
                },
            {$unwind : '$codes_users'},
            {
                $match : {
                        'codes.source.user'  : Types.ObjectId(req.params.userId),
                        createdAt :  {
                            $gte : new Date(start),
                            $lte : new Date(end)
                        }
                    }
                },
            {$sort : { createdAt : -1 }},
            {
                $project : {
                        codeId : 1,
                        coreSim : 1,
                        code : '$codes.code',
                        casa : '$codes_users.house',
                        visitorName : '$codes.visitorName',
                        createdAt : { 
                            $dateToString: { 
                                format: '%Y/%m/%d %H:%M:%S', 
                                date: '$createdAt' 
                            } 
                            }
                    }
            }
    ]);
    
    if(codeEvents){
        res.status(201).send(codeEvents);
    }else{
        res.status(503).json({'msg':'No data found'})
    }
    }
}

export const getCodeEventsCount = async (req, res, next) => {

    try{
        const codeEventsC = await code_events.aggregate([
                {$group: {_id:null, count:{$sum:1}}}
        ]);

        res.status(200).json(codeEventsC[0])

    }catch(ex){
        res.status(301).json({'Error': ex})
    }

}

export const getCodeEventsByCode = async (req, res, next) => {
  

  if(req.params.code != null){
    const events = await code_events.aggregate([
      {
        $lookup:{
            'from' : 'codes',
            'localField' : 'codeId',
            'foreignField' : '_id',
            'as': 'codeEvents_codes'

            }
     },
     {$unwind : '$codeEvents_codes'},
     {$match : {'codeEvents_codes.code' : req.params.code}},
     {$sort : {createdAt : -1}},
     {$project: {
            visitor : '$codeEvents_codes.visitorName',
            time : {
                    $dateToString: {
                      format: '%Y/%m/%d %H:%M:%S',
                      date: '$createdAt',
                      timezone: 'America/Los_Angeles'
                    }
                  }

         }
     }
   ]);
   res.status(200).json(events);
  }else {
    res.status(401).json({'msg':'code parameter not received'});
  }
}