import { Router } from 'express'
import * as configCtrl from '../controllers/configApp.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.get('',configCtrl.getConfig);
router.post('',configCtrl.getConfig);
export default router;