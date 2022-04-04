import { Router } from 'express'
import * as codeEventsCtrl from '../controllers/codeEvents.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/:codeId/:picId/:CoreSim',codeEventsCtrl.createCode_event);
router.get('/:CoreSim',[authJwt.verifyToken,authJwt.isNeighbor],codeEventsCtrl.getCode_events);
router.get('/:userId/:CoreSim/:start/:end',[authJwt.verifyToken,authJwt.isNeighbor],codeEventsCtrl.getCode_eventsByDate);
// router.get('/:CoreSim/:start/:end',codeEventsCtrl.getCode_eventsByDate);

export default router;