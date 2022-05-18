import information from "../models/info.model";
import  { Types } from "mongoose";
import path from 'path'
import sharp from "sharp";
import fs from 'fs';
import config from "../config";
import * as tools from "../tools";
import { uploadFile } from "../public/js/s3";
import AWS from "aws-sdk";

const S3 = new AWS.S3({
     bucketName : config.auth.AWS_BUCKET_NAME,
     region : config.auth.AWS_BUCKET_REGION,
     accessKeyId : config.auth.AWS_ACCESS_KEY,
     secretAccessKey : config.auth.AWS_SECRET_KEY
})

export const createInfo = async(req, res) =>{
    const imgsRoot = config.app.images_root;
    const prefix = config.app.Resized_prefix;
    let folder = '';
    tools.monthlyFolder().then(async (f,fail) => {
        if(fail){
            res.status(400).json({'msg':'Error to generate folder'})
            return;
        }

        folder = await f.toString();
        const fullPath = path.join(__dirname,'../public/',imgsRoot, folder + '/');
        const imgPath = imgsRoot + '/' + req.body.locationFolder + '/' + folder + '/';
        let resized = {} 
        // Resize image ----------------------------------------
        //--------------------------------------------
        try{

            //----- AWS S3 for non resize images -----------------------
            // const result = await uploadFile(req.file);
            // console.log('AWS S3 testing --> ',result);

            //----  aws s3 for resize images  -------------------------

            const resized_img = await sharp(fullPath + req.file.filename)
            .resize(640,480, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            // .jpeg({quality : 80})
            .toBuffer()
            .then(resized => S3.upload({
                Bucket: config.auth.AWS_BUCKET_NAME,
                Key: `${req.body.locationFolder}/${folder}/${req.file.filename}`,
                Body:resized
            }).promise());


            

            //#region ----- last version 2.5 -------------------

            // await sharp(fullPath + req.file.filename)
            // .resize(640,480, {
            //     fit: sharp.fit.inside,
            //     withoutEnlargement: true
            // })
            // .jpeg({quality : 80})
            // .toFile(fullPath + prefix + req.file.filename);

            // fs.unlink(path.join(fullPath, req.file.filename),(e) =>{
            //     if(e){
            //         console.log('error deleting file: ', error);
            //     }else{
            //         console.log('file deleted');
            //     }
            // });

            //#endregion -------------------------------------------------------

            // -- Insert into Mongo  ---------------------
                const {title,url, description, locationFolder} = req.body;
                const webImgRoot = config.app.webImgRoot  + req.body.locationFolder 
                    + '/' + folder + '/' 

                // let stats = {};
                // try{
                //     // stats = await fileSize(path.join(fullPath , req.file.filename));
                //     // stats = await fileSize(webImgRoot);
                //     console.log('file size --> ' + stats.size);
                // }catch(err){
                //     console.log('Error multer --> ', err)
                // }

                // const resized_img_meta = await resized_img.metadata();
                console.log('Metadata size --> ', await resized_img)
                const image = req.file.filename;
                // const size = stats.size;

                // const size = resized_img_meta.size;
                // const newInfo = await information({title,url,description,
                // image,'path':imgPath,size});
                const size = 0;

                const newInfo = await information({title,url,description,
                    image,'path':webImgRoot,'location':req.body.locationFolder,size});

                console.log('newInfo', newInfo);
                if(newInfo){
                    const InfoSaved = await newInfo.save();
                }


                console.log('image uploaded..!!!')
                res.status(201).json({'msg' : 'Information created'});
                
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

