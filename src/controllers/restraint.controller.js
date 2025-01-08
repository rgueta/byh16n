import Restraint  from "../models/restraint";
import { Types } from "mongoose";

export const createRestraint = async (req,res) => {
    try{
        const core_Id = req.params.coreId;
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
                coreId : coreId
            }
        };
        
        await Restraint.findOneAndUpdate(
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

async function newRestraint(coreId,data,res){
    try{
        const newRest = 
            new Restraint({coreId,data});
        const restSaved = await newRest.save();
        await res.status(200).json(restSaved);

        // await res.status(200).json({'msg': 'ok'})

    }catch(err){
        res.status(501).json({'error ': err})
    }
}

export const getRestraint = async (req,res) => {
       const coreId = Types.ObjectId(req.params.coreId);
       const restraint = await Restraint.aggregate([
           { $sort : {createdAt : -1} },
           { $limit : 1 },
           {
               $lookup : {
                   'from': 'cores',
                   'localField' : 'coreId',
                   'foreignField' : '_id',
                   'as' : 'restraint_core'
               }
           },
           {$unwind : '$restraint_core'},
            {
             '$match': {
               '$and': [
                 { 'restraint_core._id': coreId }
               ]
             }
           },
           {
               $project: {
                   name : '$restraint_core.name',
                   sim : '$restraint_core.Sim',
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