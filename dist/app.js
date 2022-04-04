"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _package = _interopRequireDefault(require("../package.json"));

require("./database");

var _initialSetup = require("./libs/initialSetup");

var _path = _interopRequireDefault(require("path"));

var _uuid = require("uuid");

var _codes = _interopRequireDefault(require("./routes/codes.routes"));

var _auth = _interopRequireDefault(require("./routes/auth.routes"));

var _users = _interopRequireDefault(require("./routes/users.routes"));

var _visitors = _interopRequireDefault(require("./routes/visitors.routes"));

var _cores = _interopRequireDefault(require("./routes/cores.routes"));

var _roles = _interopRequireDefault(require("./routes/roles.routes"));

var _alerts = _interopRequireDefault(require("./routes/alerts.routes"));

var _codeEvents = _interopRequireDefault(require("./routes/codeEvents.routes"));

var _divisions = _interopRequireDefault(require("./routes/divisions.routes"));

var _pwdRST = _interopRequireDefault(require("./routes/pwdRST.routes"));

var _twilio = _interopRequireDefault(require("./routes/twilio.routes"));

var _housing_unit = _interopRequireDefault(require("./routes/housing_unit.routes"));

var _pwdRST2 = _interopRequireDefault(require("./models/pwdRST"));

var _info = _interopRequireDefault(require("./routes/info.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--- this file is to configure express 
// import multer from "multer";
//-- router imports  -----
const cors = require("cors");

const app = (0, _express.default)();
(0, _initialSetup.createRoles)(); //  --- static files

app.use(_express.default.static('public'));
app.use('/css', _express.default.static(__dirname + '/public/css'));
app.use('/js', _express.default.static(__dirname + '/public/js'));
app.use('/img', _express.default.static(__dirname + '/public/img')); //#region --- Settings  -----------------------
// --- Set views  ----

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // app.engine('ejs', require('ejs').__express);
//-- package json taken

app.set('pkg', _package.default); // #endregion  Settings  ------------------------
//#region  -- middleware  -----------------------
// Parse URL-encoded bodies when sent by HTML forms

app.use(_express.default.static(_path.default.join(__dirname, "/public")));
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(cors());
app.use(_express.default.json());
app.use((0, _morgan.default)('dev')); // #endregion --------------------------------------
// ---- routes ----

app.get('/', (req, res) => {
  // res.sendFile(join(__dirname + '/views/index.html'));
  res.render('index', {
    text: 'This is EJS'
  });
});
app.get('/pwdResetReq', (req, res) => {
  res.render('pwdRST');
});
app.use('/api/auth', _auth.default);
app.use('/api/users', _users.default);
app.use('/api/codes', _codes.default);
app.use('/api/visitors', _visitors.default);
app.use('/api/cores', _cores.default);
app.use('/api/roles', _roles.default);
app.use('/api/codeEvent', _codeEvents.default);
app.use('/api/divisions', _divisions.default);
app.use('/api/housing_unit', _housing_unit.default);
app.use('/api/pwdResetReq', _pwdRST.default);
app.use('/api/twilio', _twilio.default); // app.use('/api/alerts',alertsRoutes)

app.use('/api/info', _info.default);
var _default = app;
exports.default = _default;
//# sourceMappingURL=app.js.map