import { Router } from 'express';
import * as citiesCtrl from '../controllers/cities.controller';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post('/:county,:state',[authJwt.verifyToken,authJwt.isAdmin],citiesCtrl.createCity);
router.get('/:country,:state',[authJwt.verifyToken,authJwt.isNeighbor],citiesCtrl.getCities);
router.delete('/:country,:state,:city',[authJwt.verifyToken,authJwt.isAdmin],citiesCtrl.deleteCityById);

export default router;