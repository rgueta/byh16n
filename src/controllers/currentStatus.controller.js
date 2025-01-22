import currentStatus  from "../models/currentStatus";
import { Types } from "mongoose";

export const createCurrentStatus = async (req,res) => {
    try{
        const core_Id = req.params.coreId;
        const name = req.params.name;
        const coreId = Types.ObjectId(core_Id);

        const options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: false
        };

        const query = { coreId : coreId };

        const update = {
            $set: {
                data: req.body,
                coreId : coreId,
                name: name
            }
        };
        
        await currentStatus.findOneAndUpdate(
            query,
            update,
            options,function(err, restraint){
                if(err){
                    res.status(500).json({'error: ': err})
                }else{
                    res.status(200);
                }
            })

    }catch(err){
        res.status(501).json({'error: ': err})
    }
     
}

async function newStatus(coreId,name,data,res){
    try{
        const newRest = 
            new currentStatus({coreId,name,data});
        const restSaved = await newRest.save();
        await res.status(200).json(restSaved);

    }catch(err){
        res.status(501).json({'error ': err})
    }
}

export const getStatus = async (req,res) => {
       const coreId = Types.ObjectId(req.params.coreId);
       const restraint = await currentStatus.aggregate([
           { $sort : {createdAt : -1} },
           { $limit : 1 },
           {
               $lookup : {
                   'from': 'cores',
                   'localField' : 'coreId',
                   'foreignField' : '_id',
                   'as' : 'currentStatus_core'
               }
           },
           {$unwind : '$currentStatus_core'},
            {
             '$match': {
               '$and': [
                 { 'currentStatus_core._id': coreId }
               ]
             }
           },
           {
               $project: {
                   name : '$currentStatus_core.name',
                   sim : '$currentStatus_core.Sim',
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