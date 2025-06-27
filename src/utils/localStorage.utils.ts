import { Preferences } from '@capacitor/preferences';
import { LocalStorageKeyEnum } from 'src/reference-data/local-storage-key.enum';

type LocaleStorageObject = Partial<Record<LocalStorageKeyEnum, any>>;

const getValueFromLocalStorage = async (
  key: LocalStorageKeyEnum,
): Promise<any> => {
  try {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

const getMultipleValueFromLocalStorage = async (
  keys: LocalStorageKeyEnum[],
): Promise<LocaleStorageObject> => {
  try {
    const result: LocaleStorageObject = {};
    for (const key of keys) {
      const { value } = await Preferences.get({ key });
      result[key] = value ? JSON.parse(value) : null;
    }
    return result;
  } catch (error) {
    console.error(`Error getting multiple keys:`, error);
    return {};
  }
};

const saveValueInLocalStorage = async (
  key: LocalStorageKeyEnum,
  value: any,
): Promise<void> => {
  try {
    const valueToSave = JSON.stringify(value);
    await Preferences.set({ key, value: valueToSave });
    // console.log(`Saved ${key} to Preferences`);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

const clearLocalStorage = async (): Promise<void> => {
  try {
    await Preferences.clear();
    // console.log('Cleared Preferences');
  } catch (error) {
    console.error('Error clearing Preferences:', error);
    throw error;
  }
};

const removeFromLocalStorage = async (key: LocalStorageKeyEnum): Promise<void> => {
  try {
    await Preferences.remove({ key });
    // console.log(`Removed ${key} from Preferences`);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
};

const getValueFromSessionStorage = async (
  key: LocalStorageKeyEnum,
): Promise<any> => {
  try {
    const { value } = await Preferences.get({ key: `__SESSION_${key}` });
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting session ${key}:`, error);
    return null;
  }
};

const saveValueInSessionStorage = async (
  key: LocalStorageKeyEnum,
  value: any,
): Promise<void> => {
  try {
    const valueToSave = JSON.stringify(value);
    await Preferences.set({ key: `__SESSION_${key}`, value: valueToSave });
    // console.log(`Saved session ${key} to Preferences`);
  } catch (error) {
    console.error(`Error saving session ${key}:`, error);
    throw error;
  }
};

const removeFromSessionStorage = async (key: LocalStorageKeyEnum): Promise<void> => {
//  try {
//    await Preferences.remove({ key: `__SESSION_${key}` });
//    // console.log(`Removed session ${key} from Preferences`);
//  } catch (error) {
//    console.error(`Error removing session ${key}:`, error);
//    throw error;
//  }
};

const clearSessionStorage = async (): Promise<void> => {
//  try {
    // Rimuovi solo le chiavi di sessione note (es. __SESSION___MK)
//    const sessionKeys = [LocalStorageKeyEnum.__MK];
//    for (const key of sessionKeys) {
//      await Preferences.remove({ key: `__SESSION_${key}` });
//      // console.log(`Removed session key __SESSION_${key}`);
//    }
//  } catch (error) {
//    console.error('Error clearing session Preferences:', error);
//    throw error;
//  }
};

const LocalStorageUtils = {
  getValueFromLocalStorage,
  saveValueInLocalStorage,
  getMultipleValueFromLocalStorage,
  clearLocalStorage,
  removeFromLocalStorage,
  getValueFromSessionStorage,
  saveValueInSessionStorage,
  clearSessionStorage,
  removeFromSessionStorage,
};

export default LocalStorageUtils;