import { Router } from 'express'
import * as codeEventsCtrl from '../controllers/codeEvents.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/new',codeEventsCtrl.createCode_event);
router.get('/:CoreSim',[authJwt.verifyToken,authJwt.isNeighbor],codeEventsCtrl.getCode_events);
router.get('/:userId/:CoreSim/:start/:end',[authJwt.verifyToken,authJwt.isNeighbor],codeEventsCtrl.getCode_eventsByDate);
router.get('/code/:code',codeEventsCtrl.getCodeEventsByCode);

router.get('/count/all/:userId',codeEventsCtrl.getCodeEventsCount);
router.get('/code/:code/:userId',codeEventsCtrl.getCodeEventsByCode);

export default router;