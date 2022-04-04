import { Router } from 'express';
import * as housing_unitCtrl from '../controllers/housing_unit.controllers';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post('/',[authJwt.verifyToken,authJwt.isAdmin],housing_unitCtrl.createHousing_unit);
router.get('/',housing_unitCtrl.getHousing_unit);
router.get('/onlyHousing_unit',housing_unitCtrl.getOnlyHousing_unit);
router.delete('/:housing_unitId',[authJwt.verifyToken,authJwt.isAdmin],housing_unitCtrl.deleteHousing_unitById);

export default router;