import { Router } from 'express';
import * as countriesCtrl from '../controllers/countries.controller';
import { authJwt, verifySignup } from "../middleware";

const router = Router();

router.post('/',[authJwt.verifyToken,authJwt.isAdmin],countriesCtrl.createCountry);
router.get('/',countriesCtrl.getCountries);
router.get('/onlyCountries',countriesCtrl.getOnlyCountries);
router.delete('/:countryId',[authJwt.verifyToken,authJwt.isAdmin],countriesCtrl.deleteCountryById);

export default router;