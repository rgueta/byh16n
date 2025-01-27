import { Router } from 'express'
import * as commentsAppCtrl from '../controllers/commentsApp.controller';
import {authJwt}  from "../middleware";
const router = Router();

router.post('/new/:coreId/:userId',commentsAppCtrl.createComment);

router.get('/:coreId',commentsAppCtrl.getCommentsApp);

export default router;