import information from "../models/info.model";
import  { Types } from "mongoose";
import path from 'path'
import sharp from "sharp";
import fs from 'fs';
import * as tools from "../tools";
// import { uploadFile } from "../public/js/s3";
import AWS from "aws-sdk";
import {v4 as uuid} from 'uuid';
import multer from "multer";

// const upload = multer({dest:  '../uploads/'});
// let middleware = upload.single('image');


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

export const createInfo_ = async(req, res, next) =>{
    const { userId,title,url, description, locationFolder } = req.query;
    // if(req.files){
    //     console.log('req.file create info --> ', req.files.image);
    //     console.log('req.file name--> ', req.files.image.name);
    // }
    // console.log('params --> ', userId,title,url, description, locationFolder);

    // const fileContent = Buffer.from(req.file.image.replace(/^data:image\/\w+;base64,/, ""),'base64');

    console.log('req.file --> ', req.file);
    console.log('req.query --> ', req.query);

    const fileStream = fs.createReadStream(req.file.path)
    console.log('fileStream -->', fileStream);

    res.status(200).json({'msg':'Ok'});


    // let controller = () => {
    //     console.log('req.query --> ', req.query);
    //     console.log('req.files --> ', req.files);
    //     res.status(200).json({'msg':'Ok'});
    // };

    // middleware(req, res, controller);

    // var upload = multer({
    //     storage: multer.diskStorage({
    //         destination: function (req, file, cb) {
    //             cb(null, 'uploads')
    //         },
    //         filename: function (req, file, cb) {
    //             cb(null, randomString.generate({ length: 7, charset:  'alphanumeric' }) + path.extname(req.files.image.name))
    //         }
    //     })
    // })

    // upload.single('image')(req, res, next)

    // return next();
    
}

export const createInfo = async(req, res) =>{
    // S3.completeMultipartUpload()
    console.log('req.file --> ', req.file);
    const { userId,title,url, description, locationFolder } = req.query;
    tools.monthlyFolder().then(async (f,fail) => {
        if(fail){
            res.status(400).json({'msg':'Error to generate folder'})
            return;
        }
        
        const folder = await f.toString();
        const image = uuid() + path.extname(req.file.filename);
        
        try{

            //#region ------ upload image to AWS.S3     --------------------------------------
        //    Option #1
            // const reader = new FileReader()
            // reader.readAsDataURL(req.file)
            // const base64str = reader.result.replace(/^data:image\/\w+;base64,/, "");
            // const fileContent = Buffer.from(base64str,'base64')
                        
                        
            // Option #2
            // const fileContent = Buffer.from(image,'base64');
            // const fileContent = new Buffer.from(image,"base64");


            // Option #3
            const fileContent = fs.createReadStream(req.file.path)

            S3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${locationFolder}/${folder}/${image}`,
                Body: fileContent,
                // ContentEncoding: "base64",
                ContentType: req.file.mimetype
                // Body: req.file.image
            }).promise( async (err, data) => {
                if (err){
                    console.log('aws Error --> ',err)
                    // res.status(401).json({'Error' : 'AWS Error: ' + err})
                }else{
                    console.log('aws Data --> ', data)
                    // const {title,url, description, locationFolder} = req.body;
                    const webImgRoot = process.env.AWS_BUCKET_NAME  + locationFolder 
                    + '/' + folder + '/' 
                    const location = locationFolder;
                    const size = req.file.size;
                     await tools.getSection(data.Location,'path').then(async (section, fail) => {
                        if(fail){
                            res.status(400).json({'msg':'Error to generate s3 path'})
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
            res.status(401).json({'error' : 'Error creating informat ' + err})
        }
    });
   
};

export const getInfo = async(req, res) =>{
    const userID = Types.ObjectId(req.params.userId);
    // const info = await information.find({enable : true}).sort({'createdAt':-1});
    const info = await information.aggregate([
        {
            $sort : {createdAt : -1}
        },
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
              {
                'disable': false
              }, {
                'info_user._id': userID
              }
            ]
          }
        },
        {
            $project: {
                title : 1,
                description : 1,
                url : 1,
                // img : { $concat: [ "$path", "$image" ]},
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

    if(!info){
        console.log('Error getting info -> ',err)
        res.status(402).json({'Error':'Error getting info' + err})
    }else{
        res.status(201).json(info)
    }    
}

export const getInfoAdmin = async(req, res) =>{
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

    if(!info){
        console.log('Error getting info -> ',err)
        res.status(402).json({'Error':'Error getting info' + err})
    }else{
        console.log(info)
        res.status(201).json(info)
    }    
}

export const updInfoStatus = async(req, res) => {
    // console.log('update info', req.params,req.body)
    await information.updateOne({'_id':req.params.infoId},
    {'$set' : {'disable' : req.body.disable}},(err,result)=>{
        if(err){
            res.status(401).json({'error':'Info status changed' + err});
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

