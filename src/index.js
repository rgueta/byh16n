//--- this file is just to run the app
import app from './app';
import { Server } from "http";
import axios from "axios";


// index setup
const PORT = process.env.PORT;

// #region   -------- http  -----------------------------
const httpServer = new Server(app,);
httpServer.listen(PORT);
// #endregion ------ http  ---------

console.log('Server listen on port: ', PORT);

// Firebase ALerts  -----------------
app.use("/api/alerts/:core/:msg", async (req, res, next) => {

    const config = {
        method: 'POST',
        url: process.env.FIREBASE_URI,
        headers: {
            'content-type': 'application/json',
            'Authorization':  'key=' + process.env.FIREBASE_API_KEY
        },
        data:  JSON.stringify({to: `/topics/${req.params.core}`, notification: {
            body: req.params.msg,
            title: 'Firebase-postman title',
            subtitle: 'Firebase-postman subtitle'
        }})
    }

    let resp = '';
    await axios(config)
    .then((result) => {
        resp = result.data
        // console.log('OK: ', result)
    })
    .catch((err) => console.log('axios error: ', err));

   return await res.status(200).send(resp);

 });