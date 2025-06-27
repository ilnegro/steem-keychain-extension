import { MultichainActionType } from '@popup/multichain/actions/action-type.enum';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import EncryptUtils from '@popup/steem/utils/encrypt.utils';

export const setMk = (mk: string, sendMk: boolean) => {
//  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.__MK, mk);
  let hashedPass = EncryptUtils.hashPassword(mk);
  if (sendMk) {
     LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.__MK, hashedPass);
  } else {
    hashedPass = mk; 
  } 
  return {
    type: MultichainActionType.SET_MK,
    payload: hashedPass,
  };
};

export const forgetMk = () => {
//  LocalStorageUtils.removeFromSessionStorage(LocalStorageKeyEnum.__MK);
  LocalStorageUtils.saveValueInSessionStorage(LocalStorageKeyEnum.IS_LOCKED, 'true');
  LocalStorageUtils.saveValueInLocalStorage(LocalStorageKeyEnum.IS_LOCKED, 'true');
  // console.log('[MkActions] save is locked');
//  const mk = LocalStorageUtils.getValueFromSessionStorage(LocalStorageKeyEnum.__MK);
//  // console.log('[MkActions] get MK');
  return {
    type: true,
    payload: true,
  };
};
