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

