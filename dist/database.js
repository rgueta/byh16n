"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.connect(_config.default.db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(db => console.log('DB successfull connectd.! ')).catch(error => console.log('DB error connection.. ', error));
//# sourceMappingURL=database.js.map