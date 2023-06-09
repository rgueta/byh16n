//--- this file is just to run the app
import app from './app';

// index setup
const PORT = process.env.PORT;


// #region   -------- http  -----------------------------
import { Server } from "http";
import { emit } from 'process';

const httpServer = new Server(app,);

httpServer.listen(PORT);
// #endregion ------ http  ---------


console.log('Server listen on port: ', PORT);



