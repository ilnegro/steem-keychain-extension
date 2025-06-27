import CryptoJS from 'crypto-js';
import md5 from 'md5';
import Logger from 'src/utils/logger.utils';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';

const KEY_SIZE = 256;
const IV_SIZE = 128;
const ITERATIONS = 100;

//const encryptJson = (content: any, encryptPassword: string): string => {
//  content.hash = md5(content.list);
//  var msg = encrypt(JSON.stringify(content), encryptPassword);
//  return msg;
//};

//const encrypt = (content: string, encryptPassword: string) => {
//  const salt = CryptoJS.lib.WordArray.random(128 / 8);
//  const key = CryptoJS.PBKDF2(encryptPassword, salt, {

//  const iv = CryptoJS.lib.WordArray.random(128 / 8);

//  const encrypted = CryptoJS.AES.encrypt(content, key, {
//    iv: iv,
//    padding: CryptoJS.pad.Pkcs7,
//    mode: CryptoJS.mode.CBC,
//  });
  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
//  const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
//  return transitmessage;
//};

const encryptJson = async (content: any): Promise<string> => {
  const ePass = await LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.__MK);
  content.hash = md5(content.list);
  const msg = await encrypt(JSON.stringify(content), ePass);
  return msg;
};

const encrypt = async (content: string, encryptPassword: string): Promise<string> => {
  const ePass = await LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.__MK);
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(ePass, salt, {
    keySize: KEY_SIZE / 32,
    iterations: ITERATIONS,
  });
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(content, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  const encryptedMessage = salt.toString() + iv.toString() + encrypted.toString();
  return encryptedMessage;
};



function decrypt(transitmessage: string, pass: string) {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  var encrypted = transitmessage.substring(64);
  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: KEY_SIZE / 32,
    iterations: ITERATIONS,
  });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
}

const decryptToJsonWithoutMD5Check = (msg: string, pwd: string) => {
  try {
    const decrypted = decrypt(msg, pwd).toString(CryptoJS.enc.Utf8);
    const decryptedJSON: any = JSON.parse(decrypted);
    if (decryptedJSON.hash != null) return decryptedJSON;
    else {
      return null;
    }
  } catch (e: any) {
    Logger.error('Error while decrypting', e);
    throw new Error(e);
  }
};

const decryptToJson = (msg: string, pwd: string) => {
  try {
    if (!msg) {
      return null;
    }

    const decrypted = decrypt(msg, pwd).toString(CryptoJS.enc.Utf8);
    const decryptedJSON: any = JSON.parse(decrypted);

    if (decryptedJSON.hash && decryptedJSON.list) return decryptedJSON;
    else {
      return null;
    }
  } catch (e: any) {
    Logger.error('Error while decrypting', e);
    return null;
  }
};

const hashPassword = (password: string): string => {
  try {
    const hashed = md5(password);
    return hashed;
  } catch (error) {
    throw error;
  }
};

const EncryptUtils = {
  encryptJson,
  encrypt,
  decryptToJson,
  decryptToJsonWithoutMD5Check,
  decrypt,
  hashPassword,
};

export default EncryptUtils;
