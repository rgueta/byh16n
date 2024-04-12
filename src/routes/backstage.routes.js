import { Router } from 'express'
import * as backstageCtrl from '../controllers/backstage.controller';
const router = Router();

router.post('/',backstageCtrl.createBackstage);
router.get('/',backstageCtrl.getBackstage);




export default router;