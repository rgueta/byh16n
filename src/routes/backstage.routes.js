import { Router } from 'express'
import * as backstageCtrl from '../controllers/backstage.controller';
import { authJwt } from "../middleware";

const router = Router();

router.post('/',backstageCtrl.createBackstage);
router.get('/:userId',[authJwt.verifyToken,authJwt.isNeighbor],backstageCtrl.getBackstage);
router.delete('/:userId/:backstageId',[authJwt.verifyToken,authJwt.isNeighbor],backstageCtrl.deleteById);





export default router;