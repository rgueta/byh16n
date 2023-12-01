import { Router } from "express";
import * as divisionCrtl from "../controllers/division.controller";
import { authJwt } from "../middleware";
const router = Router();

router.post('/:country,:state,:city:division',[authJwt.verifyToken, authJwt.isAdmin], divisionCrtl.createDivision);
router.get('/:country,:state,:city', [authJwt.verifyToken,authJwt.isNeighbor],divisionCrtl.getDivisions);
router.get('/lite/:country,:state,:city',[authJwt.verifyToken,authJwt.isNeighbor], divisionCrtl.getDivisionsLite);

export default router;