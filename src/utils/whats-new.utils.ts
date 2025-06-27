import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import manifestJson from '../../manifest.json';

const saveLastSeen = () => {
  LocalStorageUtils.saveValueInLocalStorage(
    LocalStorageKeyEnum.LAST_VERSION_UPDATE,
	manifestJson.version,
//    chrome.runtime.getManifest().version.split('.').splice(0, 2).join('.'),
  );
  LocalStorageUtils.saveValueInLocalStorage(
    LocalStorageKeyEnum.LAST_NAME_UPDATE,
	manifestJson.name,
//    chrome.runtime.getManifest().version.split('.').splice(0, 2).join('.'),
  );
  LocalStorageUtils.saveValueInLocalStorage(
    LocalStorageKeyEnum.LAST_DESCRIPTION_UPDATE,
	manifestJson.description,
//    chrome.runtime.getManifest().version.split('.').splice(0, 2).join('.'),
  );
};

export const WhatsNewUtils = {
  saveLastSeen,
};
