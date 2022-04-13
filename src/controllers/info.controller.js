import information from "../models/info.model";
import  { Types } from "mongoose";
import path from 'path'
import sharp from "sharp";
import fs, { stat } from "fs";
import config from "../config";
import * as tools from "../tools";

export const createInfo = async(req, res) =>{
    
    const imgsRoot = config.app.images_root;
    const prefix = config.app.Resized_prefix;
    let folder = '';
    tools.monthlyFolder().then(async (f,fail) => {
        if(fail){
            res.status(400).json({'msg':'Error to generate folder'})
            return;
        }

        folder = await f.toString() + '/';
        const fullPath = path.join(__dirname,'/public/',imgsRoot, folder);
        
        const imgPath = imgsRoot + folder;
        // Resize image ----------------------------------------
       console.log('resize file--> ',fullPath + req.file.filename);

        try{
            await sharp(fullPath + req.file.filename)
            .resize(640,480, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .jpeg({quality : 80})
            .toFile(fullPath + prefix + req.file.filename);

            fs.unlink(path.join(fullPath, req.file.filename),(e) =>{
                if(e){
                    console.log('error deleting file: ', error);
                }else{
                    console.log('file deleted');
                }
            });

            // -- Insert into Mongo  ---------------------
            const {title,url, description} = req.body;

            let stats = {};
            try{
                stats = await fileSize(path.join(fullPath , prefix +  req.file.filename));
                console.log('file size --> ' + stats.size);
            }catch(err){
                console.log('Error multer --> ', err)
            }

            const image = prefix + req.file.filename;
            const size = stats.size;

            const newInfo = await information({title,url,description,
            image,'path':imgPath,size});
            console.log('newInfo', newInfo);
            if(newInfo){
                const InfoSaved = await newInfo.save();
            }
                      
            res.status(201).json({'msg' : 'Information created'});
        }
        catch(err){
            console.log('Error at the end', err)
            res.status(401).json({'error' : 'Error creating informat ' + err})
        }
    });
   
};

export const getInfo = async(req, res) =>{
    // const info = await information.find({enable : true}).sort({'createdAt':-1});
    const info = await information.aggregate([
        {
            $match : {disable : false}
        },
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

