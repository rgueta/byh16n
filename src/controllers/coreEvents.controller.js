import coreEvents  from "../models/coreEvents";
import { Types } from "mongoose";

export const createCoreEvent = async (req,res) => {
    try{
        const core_Id = req.params.coreId;
        const coreId = Types.ObjectId(core_Id);

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
    const coreId = Types.ObjectId(req.params.coreId);
    const coreEvent = await coreEvents.aggregate([
        { $sort : {createdAt : -1} },
        { $limit : 1 },
        {
            $lookup : {
                'from': 'cores',
                'localField' : 'coreId',
                'foreignField' : '_id',
                'as' : 'events_core'
            }
        },
        {$unwind : '$events_core'},
        {
        '$match': {
            '$and': [
            { 'events_core._id': coreId }
            ]
        }
        },
        {
            $project: {
                name : '$events_core.name',
                sim : '$events_core.Sim',
                updatedAt : { 
                            $dateToString: { 
                                format: '%Y/%m/%d %H:%M:%S', 
                                date: '$updatedAt', 
                                timezone: 'America/Los_Angeles' 
                            } 
                            }
            }
        }
    ])

    if(!restraint){
        res.status(502).json({'Error':'Error getting info' + err})
    }else{
        res.status(200).json(restraint)
    }    
}