import {Router} from 'express'
import * as infoCtrl from "../controllers/info.controller";
import { authJwt } from "../middleware";

import path from 'path';
import multer from "multer";
import {v4 as uuid} from 'uuid';
import * as tools from "../tools";
import fs from 'fs';

const router = Router();

// multer add image  -------------
let folder = '';
 tools.monthlyFolder().then(async (f,fail) => {
    if(fail){
        console.log('Error to generate folder');
        return;
    }
     try{
        folder = await f.toString() + '/';

        const fullPath = path.join(__dirname, '../public/img/uploads/', folder);
        const imgId = uuid();

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                fs.mkdirSync(fullPath,{recursive : true})
                cb(null, fullPath);
            },
            filename: (req, file, cb) => {
                // console.log(file);
                cb(null, uuid() + path.extname(file.originalname));
            }
        });

        const upload = multer({storage});

        router.post('/:userId',upload.single('image'),[authJwt.isAdmin],infoCtrl.createInfo);
     }catch(err){
         console.log('Error multer --> ', err)
     }
 });

 router.get('/:userId',[authJwt.isNeighbor],infoCtrl.getInfo);
 router.get('/all/:userId',[authJwt.isNeighbor],infoCtrl.getInfoAdmin);
 router.post('/updStatus/:userId/:infoId',[authJwt.isAdmin],infoCtrl.updInfoStatus);

export default router;
