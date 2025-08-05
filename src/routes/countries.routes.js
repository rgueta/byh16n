import { Router } from "express";
import * as countriesCtrl from "../controllers/countries.controller";
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post(
  "/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  countriesCtrl.createCountry,
);

router.get(
  "/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  countriesCtrl.getCountries,
);

router.get(
  "/onlyCountries/:userId",
  [authJwt.verifyToken, authJwt.isNeighbor],
  countriesCtrl.getOnlyCountries,
);
router.delete(
  "/:userId/:countryId",
  [authJwt.verifyToken, authJwt.isAdmin],
  countriesCtrl.deleteCountryById,
);

export default router;
