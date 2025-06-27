import EncryptUtils from '@popup/steem/utils/encrypt.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import { BackgroundCommand } from 'src/reference-data/background-message-key.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';

function getMk() {
  return LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.__MK);
}

const login = async (mk: string) => {
  const encryptedAccounts = await LocalStorageUtils.getValueFromLocalStorage(
    LocalStorageKeyEnum.ACCOUNTS,
  );
  const accounts = await EncryptUtils.decryptToJson(encryptedAccounts, mk);
  return !!accounts;
};

async function sendBackMk() {
  chrome.runtime.sendMessage({
    command: BackgroundCommand.SEND_BACK_MK,
    value: await getMk(),
  });
}

function saveMk(newMk: string) {
//  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.__MK, newMk);
  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.__MK, EncryptUtils.hashPassword(newMk));
}

function lock() {
    LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.IS_LOCKED, 'true');
//  LocalStorageUtils.removeFromSessionStorage(LocalStorageKeyEnum.__MK);
}

const MkModule = {
  sendBackMk,
  saveMk,
  getMk,
  lock,
  login,
};
export default MkModule;
