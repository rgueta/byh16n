import {Router} from 'express'
import * as infoCtrl from "../controllers/info.controller";
import { authJwt } from "../middleware";

const router = Router();

 router.post('/:userId',[authJwt.isAdmin],infoCtrl.createInfo)
 router.get('/:userId',[authJwt.isNeighbor],infoCtrl.getInfo);
 router.get('/all/:userId',[authJwt.isNeighbor],infoCtrl.getInfoAdmin);
 router.post('/updStatus/:userId/:infoId',[authJwt.isAdmin],infoCtrl.updInfoStatus);

export default router;
