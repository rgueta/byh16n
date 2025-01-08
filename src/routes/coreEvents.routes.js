import { Router } from 'express'
import * as coreEventsCtrl from '../controllers/coreEvents.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/new/:coreId',coreEventsCtrl.createCoreEvent);

router.get('/:coreId',coreEventsCtrl.getCoreEvents);

export default router;