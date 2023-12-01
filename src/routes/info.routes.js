import {Router} from 'express'
import * as infoCtrl from "../controllers/info.controller";
import { authJwt } from "../middleware";

const router = Router();

 router.post('/:userId',[authJwt.verifyToken,authJwt.isAdmin],infoCtrl.createInfo)
 router.get('/:userId',[authJwt.verifyToken,authJwt.isNeighbor],infoCtrl.getInfo);
 router.get('/all/:userId',[authJwt.verifyToken,authJwt.isNeighbor],infoCtrl.getInfoAdmin);
 router.post('/updStatus/:userId/:infoId',[authJwt.verifyToken,authJwt.isAdmin],infoCtrl.updInfoStatus);

export default router;
