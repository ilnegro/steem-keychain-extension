import LocalStorageUtils from 'src/utils/localStorage.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import EncryptUtils from '@popup/steem/utils/encrypt.utils';
import CryptoJS from 'crypto-js';

const login = async (password: string): Promise<boolean> => {
  // console.log('[MkUtils] login called with password:', password);
  try {
    const storedMk = await LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.__MK);
    // console.log('[MkUtils] Stored MK from SessionStorage:', storedMk);
    if (!storedMk) {
      // console.log('[MkUtils] No stored MK found');
      return false;
    }
//    const isMatch = storedMk === password.trim();

    const pass = password.trim();
	const hashedPass = EncryptUtils.hashPassword(pass);
//    console.log('[MkUtils] Password: ', hashedPass);
//	const destringMK = decryptedMk.toString(CryptoJS.enc.Utf8);
//    // console.log('[MkUtils] Password MK string:', destringMK);
    const isMatch = storedMk === hashedPass;
//    // console.log('[MkUtils] Password match:', isMatch);
    if (isMatch) {
      // console.log('[MkUtils] Unlocking app');
      LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.IS_LOCKED, 'false');
    }
    return isMatch;
  } catch (error) {
    console.error('[MkUtils] Error in login:', error);
    return false;
  }
};

//const getMkFromLocalStorage = () => {
//  const mk = LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.__MK);
//  return mk;
//};

const getMkFromLocalStorage = async (): Promise<string> => {
  const mk = LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.__MK);
  return mk;
};

const saveMkInLocalStorage = (mk: string): void => {
  // console.log('[MkUtils] saveMkInLocalStorage called with mk:', mk);
  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.__MK, EncryptUtils.hashPassword(mk));
//  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.__MK, EncryptUtils.encrypt(mk, mk));
  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.IS_LOCKED, 'false');
};

const lock = (): void => {
  // console.log('[MkUtils] lock called, setting IS_LOCKED to true');
  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.IS_LOCKED, 'true');
};

const isPasswordValid = (password: string) => {
  return (
    password.length >= 16 ||
    (password.length >= 8 &&
      password.match(/.*[a-z].*/) &&
      password.match(/.*[A-Z].*/) &&
      password.match(/.*[0-9].*/))
  );
};

const isLocked = async (): Promise<boolean> => {
  // console.log('[MkUtils] isLocked called');
  const isLocked = await LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.IS_LOCKED);
  // console.log('[MkUtils] isLocked result:', isLocked);
  return isLocked === 'true';
};

const MkUtils = {
  login,
  getMkFromLocalStorage,
  saveMkInLocalStorage,
  lock,
  isLocked,
  isPasswordValid,
};

export default MkUtils;
