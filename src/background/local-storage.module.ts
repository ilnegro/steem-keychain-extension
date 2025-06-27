import BgdAccountsUtils from '@background/utils/accounts.utils';
import { AutoCompleteValue } from '@interfaces/autocomplete.interface';
import { FavoriteUserItems } from '@interfaces/favorite-user.interface';
import { Rpc } from '@interfaces/rpc.interface';
import RpcUtils from '@popup/steem/utils/rpc.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';

const CURRENT_LOCAL_STORAGE_VERSION = 5;

const checkAndUpdateLocalStorage = async () => {
  const localStorageVersion = await LocalStorageUtils.getValueFromLocalStorage(
    LocalStorageKeyEnum.LOCAL_STORAGE_VERSION,
  );

  if (!localStorageVersion) {
    try {
      const autolock = await LocalStorageUtils.getValueFromLocalStorage(
        LocalStorageKeyEnum.AUTOLOCK,
      );
      if (autolock) {
        await LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.AUTOLOCK,
          autolock, // Già JSON.parsed da LocalStorageUtils
        );
      }

      const rpcList = await LocalStorageUtils.getValueFromLocalStorage(
        LocalStorageKeyEnum.RPC_LIST,
      );
      if (rpcList) {
        await LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.RPC_LIST,
          rpcList,
        );
      }

      let activeRpc = await LocalStorageUtils.getValueFromLocalStorage(
        LocalStorageKeyEnum.CURRENT_RPC,
      );
      if (typeof activeRpc === 'string' && activeRpc !== 'DEFAULT') {
        activeRpc =
          RpcUtils.getFullList().find((rpc) => rpc.uri === activeRpc) ||
          RpcUtils.getFullList()[0];
      }

      if (
        !activeRpc ||
        (typeof activeRpc === 'object' && activeRpc.uri === 'DEFAULT') ||
        activeRpc === 'DEFAULT'
      ) {
        await LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.SWITCH_RPC_AUTO,
          true,
        );
        await LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.CURRENT_RPC,
          RpcUtils.getFullList()[0],
        );
      } else {
        await LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.CURRENT_RPC,
          activeRpc,
        );
        await LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.SWITCH_RPC_AUTO,
          false,
        );
      }

      const noConfirm = await LocalStorageUtils.getValueFromLocalStorage(
        LocalStorageKeyEnum.NO_CONFIRM,
      );
      if (noConfirm) {
        await LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.NO_CONFIRM,
          noConfirm,
        );
      }
    } finally {
      await saveNewLocalStorageVersion(2);
      await checkAndUpdateLocalStorage();
    }
  } else {
    switch (parseInt(localStorageVersion)) {
      case 2: {
        let activeRpc: Rpc = await LocalStorageUtils.getValueFromLocalStorage(
          LocalStorageKeyEnum.CURRENT_RPC,
        );
        if (
          [
            'https://anyx.io',
            'https://api.pharesim.me/',
            'https://rpc.ausbit.dev',
            'https://hived.privex.io/',
          ].includes(activeRpc?.uri)
        ) {
          await LocalStorageUtils.saveValueInLocalStorage(
            LocalStorageKeyEnum.CURRENT_RPC,
            { uri: 'https://api.steemit.com', testnet: false } as Rpc,
          );
        }
        await saveNewLocalStorageVersion(3);
        await checkAndUpdateLocalStorage();
        break;
      }
      case 3: {
        const actualFavoriteUsers: any =
          await LocalStorageUtils.getValueFromLocalStorage(
            LocalStorageKeyEnum.FAVORITE_USERS,
          );
        // Check on format
        let oldFormat = true;
        // Validation
        if (actualFavoriteUsers) {
          for (const [key, value] of Object.entries(actualFavoriteUsers)) {
            if (Array.isArray(value)) {
              value.map((favoriteObject) => {
                if (typeof favoriteObject === 'object') {
                  oldFormat = false;
                }
              });
            }
          }
        }
        if (oldFormat) {
          const favoriteUserData: any = {};
          const mk = await LocalStorageUtils.getValueFromSessionStorage(
            LocalStorageKeyEnum.__MK,
          );
          const localAccounts =
            await BgdAccountsUtils.getAccountsFromLocalStorage(mk);
          if (localAccounts) {
            // Initialize object
            for (const localAccount of localAccounts) {
              favoriteUserData[localAccount.name] = [];
            }
            // Fill the object initialized
            if (actualFavoriteUsers) {
              for (const [key, value] of Object.entries(
                actualFavoriteUsers as FavoriteUserItems,
              )) {
                favoriteUserData[key] = value.map((account) => {
                  return {
                    value: account,
                    subLabel: '',
                  } as AutoCompleteValue;
                });
              }
            }
            // Save in local storage
            await LocalStorageUtils.saveValueInLocalStorage(
              LocalStorageKeyEnum.FAVORITE_USERS,
              favoriteUserData,
            );
          }
          await saveNewLocalStorageVersion(4);
          await checkAndUpdateLocalStorage();
        }
        break;
      }
      case 4: {
        const accounts = await LocalStorageUtils.getValueFromLocalStorage(
          LocalStorageKeyEnum.ACCOUNTS,
        );

        if (accounts && accounts.length) {
          await LocalStorageUtils.saveValueInLocalStorage(
            LocalStorageKeyEnum.HAS_FINISHED_SIGNUP,
            true,
          );
        }
        await saveNewLocalStorageVersion(5);
        await checkAndUpdateLocalStorage();
        break;
      }
    }
  }
};

const saveNewLocalStorageVersion = async (version: number) => {
  await LocalStorageUtils.saveValueInLocalStorage(
    LocalStorageKeyEnum.LOCAL_STORAGE_VERSION,
    version,
  );
};

const LocalStorageModule = { checkAndUpdateLocalStorage };

export default LocalStorageModule;