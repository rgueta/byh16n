import { Router } from 'express'
import * as codeEventsCtrl from '../controllers/codeEvents.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/new',codeEventsCtrl.createCode_event);
router.post('/newJustCode/:code',codeEventsCtrl.createCodeEvent_justCode);

router.get('/:CoreSim/:userId',codeEventsCtrl.getCode_events);
router.get('/:userId/:start/:end',[authJwt.verifyToken,authJwt.isNeighbor],codeEventsCtrl.getCode_events);
router.get('/code/:code',codeEventsCtrl.getCodeEventsByCode);

router.get('/count/all/:userId',codeEventsCtrl.getCodeEventsCount);
router.get('/code/:code/:userId',codeEventsCtrl.getCodeEventsByCode);

router.get('/scan_dashboard',codeEventsCtrl.getCode_events);

export default router;