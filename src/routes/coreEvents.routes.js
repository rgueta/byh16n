import { Router } from 'express'
import * as coreEventsCtrl from '../controllers/coreEvents.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/new',coreEventsCtrl.createCoreEvent);

router.get('/:CoreSim/:userId',coreEventsCtrl.getCoreEvents);

export default router;