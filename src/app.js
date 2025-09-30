//--- this file is to configure express
import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import "./database";
import { createRoles } from "./libs/initialSetup";
import path from "path";
const cors = require("cors");

//-- router imports  -----
import codesRoutes from "./routes/codes.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import visitorsRoutes from "./routes/visitors.routes";
import coresRoutes from "./routes/cores.routes";
import rolesRoutes from "./routes/roles.routes";
import alertsRoutes from "./routes/alerts.routes";
import codeEventsRoutes from "./routes/codeEvents.routes";
import divisionsRoutes from "./routes/divisions.routes";
import pwdRSTRoutes from "./routes/pwdRST.routes";
import twilioRoutes from "./routes/twilio.routes";
import housing_unitRoutes from "./routes/housing_unit.routes";
import infoRoutes from "./routes/info.routes";
import countriesRoutes from "./routes/countries.routes";
import statesRoutes from "./routes/states.routes";
import citiesRoutes from "./routes/cities.routes";
import cpusRoutes from "./routes/cpus.routes";
import configAppRoutes from "./routes/configApp.routes";
import backstageRoutes from "./routes/backstage.routes";
import coreEvents from "./routes/coreEvents.routes";
import currentStatusRoutes from "./routes/currentStatus.routes";
import commentsAppRoutes from "./routes/commentsApp.routes";

const app = express();

// Create change backstage watcher  ----------------------
import backstage from "./models/backstage";
const changeStream = backstage.watch();
changeStream.on("change", (change) => {
  console.log("backstage alert change: ", change);
});

// Lista de dominios permitidos
const whitelist = [
  "https://tu-dominio-frontend.com",
  "https://otro-dominio.com",
  "http://192.168.1.246:5000",
  "http://192.168.1.185:5000",
];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Si el dominio de la petición está en la lista blanca O si no hay origen (p.ej. Postman o curl),
//     // permite la conexión.
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       // De lo contrario, rechaza la conexión
//       callback(new Error("No permitido por CORS"));
//     }
//   },
//   optionsSuccessStatus: 200, // Para navegadores antiguos (IE11, varios SmartTVs)
// };

// // Middleware de CORS para producción: usa las opciones de la lista blanca
// app.use(cors(corsOptions));
//

// // Enable CORS for all routes (development only)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  }),
);

// app.options("*", cors());

createRoles();

//  --- static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/img", express.static(__dirname + "/public/img"));

//#region --- Settings  -----------------------
// --- Set views  ----
// app.set('views', __dirname + '/views');
app.set("views", __dirname + "/public/views");
// app.set('views', './views');
app.set("view engine", "ejs");
// app.engine('ejs', require('ejs').__express);

//-- package json taken
app.set("pkg", pkg);

// #endregion  Settings  ------------------------

//#region  -- middleware  -----------------------
// Parse URL-encoded bodies when sent by HTML forms

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(morgan(":date[iso] :method :url :status (:response-time ms"));

// #endregion --------------------------------------

// ---- routes ----
app.get("/", (req, res) => {
  // res.sendFile(join(__dirname + '/views/index.html'));
  res.render("index", { text: "This is EJS" });
});

app.get("/pwdResetReq", (req, res) => {
  res.render("pwdRST");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/codes", codesRoutes);
app.use("/api/visitors", visitorsRoutes);
app.use("/api/cores", coresRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/codeEvent", codeEventsRoutes);
app.use("/api/divisions", divisionsRoutes);
app.use("/api/housing_unit", housing_unitRoutes);
app.use("/api/pwdResetReq", pwdRSTRoutes);
app.use("/api/twilio", twilioRoutes);
// app.use('/api/alerts',alertsRoutes);
app.use("/api/info", infoRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/states", statesRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/cpus", cpusRoutes);
app.use("/api/config", configAppRoutes);
app.use("/api/backstage", backstageRoutes);
app.use("/api/coreEvents", coreEvents);
app.use("/api/currentStatus", currentStatusRoutes);
app.use("/api/commentsApp", commentsAppRoutes);

export default app;
