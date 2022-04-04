"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = exports.decrypt = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const algorithm = 'aes-256-cbc';

const key = _crypto.default.randomBytes(32);

const iv = _crypto.default.randomBytes(16); //Encrypting text


const encrypt = async text => {
  let cipher = _crypto.default.createCipheriv('aes-256-cbc', Buffer.from(key), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  };
}; // Decrypting text


exports.encrypt = encrypt;

const decrypt = async text => {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');

  let decipher = _crypto.default.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.decrypt = decrypt;
//# sourceMappingURL=tools.js.map