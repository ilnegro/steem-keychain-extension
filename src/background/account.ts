import MkModule from '@background/mk.module';
import BgdAccountsUtils from '@background/utils/accounts.utils';
import EncryptUtils from '@popup/steem/utils/encrypt.utils';
import { BackgroundCommand } from '@reference-data/background-message-key.enum';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';

const sendBackImportedAccounts = async (fileContent: string) => {
  if (fileContent?.length) {
    const mk = await MkModule.getMk();
    let importedAccounts;
    try {
      importedAccounts = BgdAccountsUtils.getAccountsFromFileData(
        fileContent,
        mk,
      );
    } catch (e) {
      chrome.runtime.sendMessage({
        command: BackgroundCommand.SEND_BACK_IMPORTED_ACCOUNTS,
        value: { feedback: { message: 'import_html_error' } },
      });
      return;
    }

    const accounts =
      EncryptUtils.decryptToJson(
        await LocalStorageUtils.getValueFromLocalStorage(
          LocalStorageKeyEnum.ACCOUNTS,
        ),
        mk,
      ) || [];

    const newAccounts =
      await BgdAccountsUtils.mergeImportedAccountsToExistingAccounts(
        importedAccounts,
        accounts.list || [],
      );
    const newAccountsEncrypted = EncryptUtils.encryptJson(
      { list: newAccounts },
//      mk,
    );
    await LocalStorageUtils.saveValueInLocalStorage(
      LocalStorageKeyEnum.ACCOUNTS,
      newAccountsEncrypted,
    );

	const extensionId = 'steem-keychain-app';
    chrome.runtime.sendMessage({
      command: BackgroundCommand.SEND_BACK_IMPORTED_ACCOUNTS,
      value: {
        accounts: newAccounts,
        feedback: null,
      },
    });
  }
};

const AccountModule = {
  sendBackImportedAccounts,
};

export default AccountModule;
