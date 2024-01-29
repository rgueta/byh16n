import {Router} from 'express'
import * as infoCtrl from "../controllers/info.controller";
import { authJwt } from "../middleware";

import multer from "multer";
// const storage = multer.diskStorage({
//     destination: (req, res, cb) => {
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, uniqueSuffix + '-' + file.originalname)
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({storage: storage})
const router = Router();

 router.post('/:userId', [authJwt.verifyToken,authJwt.isNeighbor],upload.single('image'), infoCtrl.createInfo);
 router.get('/:userId', [authJwt.verifyToken,authJwt.isNeighbor], infoCtrl.getInfo);

 router.get('/all/:userId',[authJwt.verifyToken,authJwt.isNeighbor],infoCtrl.getInfoAdmin);
 router.post('/updStatus/:userId/:infoId',[authJwt.verifyToken,authJwt.isAdmin],infoCtrl.updInfoStatus);

export default router;
