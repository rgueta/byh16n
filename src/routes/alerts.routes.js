import { Router } from 'express';
import * as alertsCtrl from '../controllers/alerts.controller';

const router = Router();

router.get('/',alertsCtrl.getAlerts);
router.post('/',alertsCtrl.createAlert);

export default router;