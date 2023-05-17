import {Router} from 'express'
import * as authCtrl from '../controllers/auth.controller';
import {verifySignup  } from "../middleware";
import { verifyToken } from '../middleware/authjwt';

const router = Router();



router.post('/signup',[verifyToken,  verifySignup.checkDuplicateUsernameEmail,verifySignup.checkRolesExists],authCtrl.signUp);
router.post('/signin',authCtrl.signIn);
router.get('/refresh',authCtrl.refresh);
router.post('/logout',authCtrl.logout);



export default router;