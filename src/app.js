//--- this file is to configure express 
import express from 'express';
import morgan from 'morgan';
// import multer from "multer";
import pkg from '../package.json';
import "./database";
import {createRoles} from './libs/initialSetup';
import path from 'path';
import {v4 as uuid} from 'uuid';


//-- router imports  -----
import codesRoutes from './routes/codes.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from "./routes/users.routes";
import visitorsRoutes from "./routes/visitors.routes";
import coresRoutes from './routes/cores.routes';
import rolesRoutes from './routes/roles.routes';
import alertsRoutes from "./routes/alerts.routes";
import codeEventsRoutes from "./routes/codeEvents.routes";
import divisionsRoutes  from "./routes/divisions.routes";
import pwdRSTRoutes from "./routes/pwdRST.routes";
import twilioRoutes from "./routes/twilio.routes";
import housing_unitRoutes from "./routes/housing_unit.routes";
import pwdRST from './models/pwdRST';
import infoRoutes  from "./routes/info.routes";


const cors = require("cors");

const app = express();
createRoles();

//  --- static files
app.use(express.static('public'));
app.use('/css',express.static(__dirname + '/public/css'));
app.use('/js',express.static(__dirname + '/public/js'));
app.use('/img',express.static(__dirname + '/public/img'));

//#region --- Settings  -----------------------
// --- Set views  ----
// app.set('views', __dirname + '/views');
app.set('views', __dirname + '/public/views');
// app.set('views', './views');
app.set('view engine','ejs');
// app.engine('ejs', require('ejs').__express);

//-- package json taken
app.set('pkg',pkg);

// #endregion  Settings  ------------------------

//#region  -- middleware  -----------------------
// Parse URL-encoded bodies when sent by HTML forms
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// #endregion --------------------------------------

// ---- routes ----
app.get('/',(req,res) =>{
    // res.sendFile(join(__dirname + '/views/index.html'));
    res.render('index',{text: 'This is EJS'});
});

app.get('/pwdResetReq',(req, res) => {
    res.render('pwdRST');
});

app.use('/api/auth',authRoutes);
app.use('/api/users',usersRoutes);
app.use('/api/codes',codesRoutes);
app.use('/api/visitors',visitorsRoutes);
app.use('/api/cores',coresRoutes);
app.use('/api/roles',rolesRoutes);
app.use('/api/codeEvent',codeEventsRoutes);
app.use('/api/divisions',divisionsRoutes);
app.use('/api/housing_unit',housing_unitRoutes);
app.use('/api/pwdResetReq',pwdRSTRoutes);
app.use('/api/twilio',twilioRoutes);
// app.use('/api/alerts',alertsRoutes)
app.use('/api/info', infoRoutes);

export default app;
