import information from "../models/info.model";
import  { Types } from "mongoose";
// import path from "path";
import fs from 'fs';
import * as tools from "../tools";
// import { uploadFile } from "../public/js/s3";
import AWS from "aws-sdk";
import {v4 as uuid} from 'uuid';

const S3 = new AWS.S3({
    bucketName : process.env.AWS_BUCKET_NAME,
    region : process.env.AWS_BUCKET_REGION,
    maxRetries:3,
    credentials:{
       accessKeyId : process.env.AWS_ACCESS_KEY,
       secretAccessKey : process.env.AWS_SECRET_KEY
    },
    httpOptions:{timeout: 300000, connectTimeout:5000}
})

export const createInfo = async(req, res) =>{

    const { userId,title,url, description, locationFolder } = req.query;
    tools.monthlyFolder().then(async (f,fail) => {
        if(fail){
            res.status(501).json({'msg':'Error to generate folder'})
            return;
        }
        
        const folder = await f.toString();
        const image = uuid() + '.' + req.file.originalname.split('.').pop();
        
        try{

            //#region ------ upload image to AWS.S3     --------------------------------------
            // const fileContent = fs.createReadStream(req.file.path);
            const fileContent = await req.file;

            S3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${locationFolder}/${folder}/${image}`,
                Body: fileContent.buffer,
                ContentType: fileContent.mimetype
            }).promise( async (err, data) => {
                if (err){
                    console.log('aws Error --> ',err);
                    res.status(501).json({'Error' : 'AWS Error: ' + err})
                }else{
                    const webImgRoot = process.env.AWS_BUCKET_NAME  + locationFolder 
                    + '/' + folder + '/' 
                    const location = locationFolder;
                    const size = req.file.size;
                     await tools.getSection(data.Location,'path').then(async (section, fail) => {
                        if(fail){
                            res.status(501).json({'msg':'Error to generate s3 path'})
                            return;
                        }
                        const path = section;

                    // #region  Insert into Mongo  ---------------------
                
                        const newInfo = await information({title, url, description,
                            image, path, location, size});

                        if(newInfo){
                            const InfoSaved = await newInfo.save();
                        }
                    // #endregion -------------------------
                    
                        console.log('image uploaded..!!!')
                        res.status(201).json({'msg' : 'Information created'});
                    });
            // #endregion -------------------------
            }})
           
        }
        catch(err){
            console.log('Error at the end', err)
            res.status(501).json({'error' : 'Error creating informat ' + err})
        }
    });
}


export const getInfo = async(req, res) =>{
    
    let now = await new Date(req.params.now);

    const userID = Types.ObjectId(req.params.userId);
    // const info = await information.find({enable : true}).sort({'createdAt':-1});
    const info = await information.aggregate([
        { $sort : {createdAt : -1} },
        { $limit : 300 },
        {
            $lookup : {
                'from': 'users',
                'localField' : 'location',
                'foreignField' : 'location',
                'as' : 'info_user'
            }
        },
        {$unwind : '$info_user'},
         {
          '$match': {
            '$and': [
              { 'disable': false }, 
              { 'info_user._id': userID }
            //   { 'updatedAt': { $gte : new Date(now)}}
            ]
          }
        },
        {
            $project: {
                title : 1,
                description : 1,
                url : 1,
                image : 1,
                path : 1,
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

    if(!info){
        res.status(502).json({'Error':'Error getting info' + err})
    }else{
        res.status(201).json(info)
    }    
}

export const getInfoAdmin = async(req, res) =>{

    try{
        const info = await information.aggregate([
            {
                $sort : {createdAt : -1}
            },
            {
                $project: {
                    title : 1,
                    description : 1,
                    url : 1,
                    image : 1,
                    path : 1,
                    disable : 1,
                    size : {$concat : [
                            { $toString : 
                                {$round : [{$divide : ['$size',1024]}, 2]}
                            }, ' KB']
                        },
                    createdAt : { 
                                $dateToString: { 
                                    format: '%Y/%m/%d %H:%M:%S', 
                                    date: '$createdAt', 
                                    timezone: 'America/Los_Angeles' 
                                } 
                                }
                }
            }
        ])

        // console.log(info)
        res.status(201).json(info)

    }catch(err){
        res.status(502).json({'Error':'Error getting info' + err})
    }
}

export const updInfoStatus = async(req, res) => {
    // console.log('update info', req.params,req.body)
    await information.updateOne({'_id':req.params.infoId},
    {'$set' : {'disable' : req.body.disable}},(err,result)=>{
        if(err){
            res.status(501).json({'error':'Info status changed' + err});
            return;
        }else{
            res.status(201).json({'msg':'Info status changed'});
        }
    });
        
}

async function fileSize(file){
    const stats = await fs.statSync(file);
    return stats
}

