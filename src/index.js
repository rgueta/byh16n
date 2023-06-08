//--- this file is just to run the app
import app from './app';
import request from "request";

// index setup
const PORT = process.env.PORT;


// #region   -------- http  -----------------------------
import { Server } from "http";
import { emit } from 'process';

const httpServer = new Server(app,);

httpServer.listen(PORT);
// #endregion ------ http  ---------


console.log('Server listen on port: ', PORT);

// Firebase ALerts  -----------------
app.use("/api/alerts/:core/:msg", async (req, res) => {
    // console.log('Alert pedestrina! ' + new Date().toLocaleString());
    // console.log('Msg --> ',req.params.msg);
    // console.log('Body --> ', req.body);
    fcmAlerts(req,res);
    // res.send({'Alert core ': req.params.core})

  });

  async function fcmAlerts(req, res) {
    console.log(`Alert. ! core :  ${req.params.core}, ` + new Date().toLocaleString());
    let body = req.body;
    console.log('body --> ', body);
    let details = { body  };
    let options = {
        hostname: process.env.FIREBASE_URI_LOCAL,
        method: 'POST',
        Headers: {
            'Content-Type' : 'application/json',
            'Authentication':'key=' + process.env.FIREBASE_API_KEY
        }
    }
    let result = await request(options, details).listen(8080);
    res.json(body);
  }

  async function fcmAlerts_(req, res) {
    let body = req.body;
    let details = {
        to:body.to,
        name: body.name,
        id: body.id,
        title: body.title
    };
    let options = {
        hostname: process.env.FIREBASE_URI_LOCAL,
        method: 'POST',
        Headers: {
            'Content-Type' : 'application/json',
            'Authentication':'key=' + process.env.FIREBASE_API_KEY
        }
    }
    let result = await request(options, details);
    res.json({'core':body.core,'item':body.item,
        'message':body.message
    });
  }

