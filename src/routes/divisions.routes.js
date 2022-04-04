import { Router } from "express";
import * as divisionCrtl from "../controllers/division.controller";
import { authJwt } from "../middleware";
const router = Router();

router.post('/',[authJwt.verifyToken, authJwt.isAdmin], divisionCrtl.createDivision);
router.get('/', divisionCrtl.getDivisions);
router.get('/lite/', divisionCrtl.getDivisionsLite);

export default router;