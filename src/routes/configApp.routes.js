import { Router } from 'express'
import * as configCtrl from '../controllers/configApp.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.get('',configCtrl.getConfig);
router.post('',configCtrl.getConfig);
// router.get('/:CoreSim',[authJwt.verifyToken,authJwt.isNeighbor],codeEventsCtrl.getCode_events);
// router.get('/:userId/:CoreSim/:start/:end',[authJwt.verifyToken,authJwt.isNeighbor],codeEventsCtrl.getCode_eventsByDate);

export default router;