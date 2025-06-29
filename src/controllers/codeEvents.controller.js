import code_events  from "../models/code_events";
import { Types } from "mongoose";
import Codes  from "../models/Codes";
const newObjectId = new Types.ObjectId();

export const createCode_event = async (req,res) => {
    try{
        let doorName = '';
        const code_Id = req.body.codeId;
        const picId = req.body.picId;
        const CoreSim = req.body.CoreSim;
        const codeId = newObjectId(code_Id);

        if(req.body.doorName){
            doorName = req.body.doorName;
        }

        newCodeEvent(codeId, picId, CoreSim, doorName, res)
        // res.status(201).json(eventSaved);

    }catch(err){
        // console.log('createCode_event Error --> ', err)
        res.status(501).json({'msg..': err})
    }
     
}

async function newCodeEvent(codeId,picId,CoreSim,doorName,res){
    try{
        const newCode_event = 
            new code_events({codeId,picId,CoreSim,doorName});
        const eventSaved = await newCode_event.save();
         // using global io from index.js
        await global._io.emit('codeEvent',{'msg':'event triggered'})
        await res.status(201).json({'msg':'ok'});
    }catch(err){
        // console.log('createCode_event Error --> ', err)
        res.status(501).json({'msg..': err})
    }
}

async function callQuery(query){
    try{
        return await code_events.aggregate(query)
    }catch(err){
        console.log('Error: ', err);
        return ''
    }
}

export const createCodeEvent_justCode = async (req,res) => {
    let now = await new Date();
    try{
        let code = await Codes.find({
            code: req.params.code,
            enable: 1,
            expiry: { $gte: now.toISOString()}
          });
    
        if(code.length > 0){
            await newCodeEvent(code[0]._id, req.body.picId,
                req.body.CoreSim, req.body.doorName, res)
            // res.status(200).json({'valid': true});
        }else{
            res.status(500).json({'valid':false});
          }
    }catch(err){
    // console.log('createCode_event Error --> ', err)
    res.status(501).json({'msg..': err})
    }

}

export const getCode_events = async (req,res) => {
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
            'codes.source.user'  : newObjectId(req.params.userId),
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

export const getCode_eventsByDate = async (req,res) => {

    let start = await new Date(req.params.start);
    let end = await new Date(req.params.end);

    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    end.setMinutes(end.getMinutes() - start.getTimezoneOffset());


    if(req.params.start != null && req.params.end != null){
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
                        'codes.source.user'  : newObjectId(req.params.userId),
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