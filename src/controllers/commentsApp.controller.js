import commentsApp  from "../models/commentsApp";
import { Types } from "mongoose";

export const createComment = async (req,res) => {
    try{
        const core_Id = req.params.coreId;
        const user_Id = req.params.userId;
        const comment = req.body.comment;
        const coreId = Types.ObjectId(core_Id);
        const userId = Types.ObjectId(user_Id);
        let options = {};
        let update = {};
        
        options = {
            upsert: true,
            new: true,
            setDefaultsOnInsert: false
        };

        newCodeEvent(coreId, userId, comment);

    }catch(err){
        res.status(501).json({'error: ': err})
    }
     
}

async function newComment(coreId, userId, comment){
    try{
        const newRest = 
            new commentsApp({coreId, userId, comment});
        const restSaved = await newRest.save();
        await res.status(200).json(restSaved);

    }catch(err){
        res.status(501).json({'error ': err})
    }
}

export const getCommentsApp = async (req,res) => {
       const coreId = Types.ObjectId(req.params.coreId);
       const comments = await commentsApp.aggregate([
           { $sort : {createdAt : -1} },
           { $limit : 1 },
           {
            $lookup : {
                'from': 'users',
                'localField' : 'userId',
                'foreignField' : '_id',
                'as' : 'users_core'
            }
            },
            {$unwind : '$users_core'},
           {
               $lookup : {
                   'from': 'cores',
                   'localField' : 'coreId',
                   'foreignField' : '_id',
                   'as' : 'commentsApp_core'
               }
           },
           {$unwind : '$commentsApp_core'},
            {
             '$match': {
               '$and': [
                 { 'commentsApp_core._id': coreId }
               ]
             }
           },
           {
               $project: {
                   core : '$commentsApp_core.name',
                   user : '$users_core.name',
                   comment:1,
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