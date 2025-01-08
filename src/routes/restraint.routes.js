import { Router } from 'express'
import * as restraintCtrl from '../controllers/restraint.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/new/:coreId',restraintCtrl.createRestraint);

router.get('/:coreId',restraintCtrl.getRestraint);

export default router;