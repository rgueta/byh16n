import { Router } from 'express'
import * as currentStatusCtrl from '../controllers/currentStatus.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/new/:name/:coreId',currentStatusCtrl.createCurrentStatus);

router.get('/:coreId',currentStatusCtrl.getStatus);

export default router;