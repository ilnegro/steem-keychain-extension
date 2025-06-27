import {
  AccountUpdateOperation,
  Authority,
  ClaimAccountOperation,
  cryptoUtils,
  DynamicGlobalProperties,
  ExtendedAccount,
} from '@steempro/dsteem/lib/index-browser';
import { CurrencyPrices } from '@interfaces/bittrex.interface';
import { HiveInternalMarketLockedInOrders } from '@interfaces/steem-market.interface';
import EncryptUtils from '@popup/steem/utils/encrypt.utils';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import MkUtils from '@popup/steem/utils/mk.utils';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';
import { AccountValueType } from '@reference-data/account-value-type.enum';
import Config from 'src/config';
import { Accounts } from 'src/interfaces/accounts.interface';
import { ActiveAccount, RC } from 'src/interfaces/active-account.interface';
import {
  Key,
  Keys,
  KeyType,
  TransactionOptions,
} from 'src/interfaces/keys.interface';
import { LocalAccount } from 'src/interfaces/local-account.interface';
import { KeychainError } from 'src/keychain-error';
import { LocalStorageKeyEnum } from 'src/reference-data/local-storage-key.enum';
import FormatUtils from 'src/utils/format.utils';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import Logger from 'src/utils/logger.utils';

export enum AccountErrorMessages {
  INCORRECT_KEY = 'popup_accounts_incorrect_key',
  INCORRECT_USER = 'popup_accounts_incorrect_user',
  MISSING_FIELDS = 'popup_accounts_fill',
  ALREADY_REGISTERED = 'popup_accounts_already_registered',
  PASSWORD_IS_PUBLIC_KEY = 'popup_account_password_is_public_key',
}

const getKeys = async (username: string, password: string) => {
  const hiveAccounts = await AccountUtils.getAccount(username);
  if (hiveAccounts.length === 0) {
    throw new Error(AccountErrorMessages.INCORRECT_USER);
  }
  const activeInfo = hiveAccounts[0].active;
  const postingInfo = hiveAccounts[0].posting;
  const memoKey = hiveAccounts[0].memo_key;

  if (cryptoUtils.isWif(password)) {
    const pubUnknown = KeysUtils.getPublicKeyFromPrivateKeyString(password);
    if (pubUnknown === memoKey) {
      return {
        memo: password,
        memoPubkey: memoKey,
      };
    } else if (KeysUtils.getPubkeyWeight(pubUnknown, postingInfo)) {
      return {
        posting: password,
        postingPubkey: pubUnknown,
      };
    } else if (KeysUtils.getPubkeyWeight(pubUnknown, activeInfo)) {
      return {
        active: password,
        activePubkey: pubUnknown,
      };
    }
  }

  const keys = KeysUtils.derivateFromMasterPassword(
    username,
    password,
    hiveAccounts[0],
  );

  if (!keys) {
    throw new Error(AccountErrorMessages.INCORRECT_KEY);
  }
  return keys;
};

const verifyAccount = async (
  username: string,
  password: string,
  existingAccounts: LocalAccount[],
): Promise<Keys | null> => {
  if (password.startsWith('STM')) {
    throw new Error(AccountErrorMessages.PASSWORD_IS_PUBLIC_KEY);
  }

  if (username.length === 0 || password.length === 0) {
    throw new Error(AccountErrorMessages.MISSING_FIELDS);
  }
  if (isAccountNameAlreadyExisting(existingAccounts, username)) {
    throw new Error(AccountErrorMessages.ALREADY_REGISTERED);
  }

  return await getKeys(username, password);
};
/* istanbul ignore next */
const saveAccounts = async (localAccounts: LocalAccount[], mk: string) => {
  const accounts: Accounts = { list: localAccounts };
  const encyptedAccounts = await AccountUtils.encryptAccounts(accounts, mk);
  LocalStorageUtils.saveValueInLocalStorage(
    LocalStorageKeyEnum.ACCOUNTS,
    encyptedAccounts,
  );
};

const getAccountFromLocalStorage = async (
  username: string,
): Promise<LocalAccount | undefined> => {
  const mk = await MkUtils.getMkFromLocalStorage();
  const accounts = await getAccountsFromLocalStorage(mk);
  return accounts.find((acc) => acc.name === username);
};

/* istanbul ignore next */
const getAccountsFromLocalStorage = async (
  mk: string,
): Promise<LocalAccount[]> => {
  const encryptedAccounts = await LocalStorageUtils.getValueFromLocalStorage(
    LocalStorageKeyEnum.ACCOUNTS,
  );
  const accounts = EncryptUtils.decryptToJson(encryptedAccounts, mk);
  return accounts?.list.filter(
    (e: LocalAccount) => e.name.length,
  ) as LocalAccount[];
};

const isAccountNameAlreadyExisting = (
  existingAccounts: LocalAccount[],
  accountName: string,
): boolean => {
  if (!existingAccounts || existingAccounts.length === 0) {
    return false;
  }
  return existingAccounts.some(
    (account: LocalAccount) => account.name === accountName,
  );
};
/* istanbul ignore next */
const encryptAccounts = async (accounts: Accounts, mk: string) => {
//  return EncryptUtils.encryptJson(accounts, mk);
  return EncryptUtils.encryptJson(accounts);
};

const hasStoredAccounts = async () => {
  return (
    (await LocalStorageUtils.getValueFromLocalStorage(
      LocalStorageKeyEnum.ACCOUNTS,
    )) !== undefined
  );
};

const addAuthorizedKey = async (
  activeAccount: ActiveAccount,
  authorizedAccountName: string,
  existingAccounts: LocalAccount[],
  mk: string,
  keyType: string,
) => {
  let authorizedAccount = existingAccounts.find(
    (account: LocalAccount) => account.name === authorizedAccountName,
  );

  let localActiveAccount = existingAccounts.find(
    (account: LocalAccount) => account.name === activeAccount.name,
  );

  if (!authorizedAccount || !localActiveAccount) return; // check error

  localActiveAccount.keys[keyType.toLowerCase() as keyof Keys] =
    authorizedAccount.keys[keyType.toLowerCase() as keyof Keys];
  localActiveAccount.keys[
    `${keyType.toLowerCase()}Pubkey` as keyof Keys
  ] = `@${authorizedAccountName}`;

  return await AccountUtils.saveAccounts(existingAccounts, mk);
};

const addAuthorizedAccount = async (
  username: string,
  authorizedAccount: string,
  existingAccounts: LocalAccount[],
): Promise<Keys | null> => {
  let localAuthorizedAccount: LocalAccount;

  if (username === '' || authorizedAccount === '') {
    throw new KeychainError('popup_accounts_fill', []);
  }

  if (
    !existingAccounts
      .map((localAccount: LocalAccount) => localAccount.name)
      .includes(authorizedAccount)
  ) {
    throw new KeychainError('popup_no_auth_account', [authorizedAccount]);
  } else {
    localAuthorizedAccount = existingAccounts.find(
      (localAccount: LocalAccount) => localAccount.name === authorizedAccount,
    )!;
  }

  if (
    existingAccounts
      .map((localAccount: LocalAccount) => localAccount.name)
      .includes(username)
  ) {
    throw new KeychainError('popup_accounts_already_registered', []);
  }

  const hiveAccounts = await AccountUtils.getAccount(username);
  if (!hiveAccounts || hiveAccounts.length === 0) {
    throw new KeychainError('popup_accounts_incorrect_user', []);
  }
  let hiveAccount = hiveAccounts[0];

  const activeKeyInfo = hiveAccount.active;
  const postingKeyInfo = hiveAccount.posting;

  let keys: Keys = {};

  const activeAuth = activeKeyInfo.account_auths.find(
    (accountAuth) => accountAuth[0] === authorizedAccount,
  );
  const postingAuth = postingKeyInfo.account_auths.find(
    (accountAuth) => accountAuth[0] === authorizedAccount,
  );
  if (!activeAuth && !postingAuth) {
    throw new KeychainError('popup_accounts_no_auth', [
      authorizedAccount,
      username,
    ]);
  }

  if (activeAuth) {
    keys.active = localAuthorizedAccount.keys.active;
    keys.activePubkey = `@${authorizedAccount}`;
  }
  if (postingAuth) {
    keys.posting = localAuthorizedAccount.keys.posting;
    keys.postingPubkey = `@${authorizedAccount}`;
  }

  return keys;
};

const addKey = async (
  activeAccount: ActiveAccount,
  accounts: LocalAccount[],
  privateKey: string,
  keyType: KeyType,
  mk: string,
) => {
  if (privateKey.length === 0 || privateKey.trim().length === 0) {
    throw new Error(AccountErrorMessages.MISSING_FIELDS);
  }

  if (privateKey.startsWith('STM')) {
    throw new Error(AccountErrorMessages.PASSWORD_IS_PUBLIC_KEY);
  }
  const keys = await AccountUtils.getKeys(activeAccount.name!, privateKey);

  Logger.info(`keys ${keys}`);
  let account = accounts.find(
    (account: LocalAccount) => account.name === activeAccount.name,
  );
  if (keys && account) {
    switch (keyType) {
      case KeyType.ACTIVE:
        if (!keys.active) {
          throw new Error('popup_html_wrong_key_active');
        }
        account.keys.active = keys.active;
        account.keys.activePubkey = keys.activePubkey;
        break;
      case KeyType.POSTING:
        if (!keys.posting) {
          throw new Error('popup_html_wrong_key_posting');
        }
        account.keys.posting = keys.posting;
        account.keys.postingPubkey = keys.postingPubkey;
        break;
      case KeyType.MEMO:
        if (!keys.memo) {
          throw new Error('popup_html_wrong_key_memo');
        }
        account.keys.memo = keys.memo;
        account.keys.memoPubkey = keys.memoPubkey;
        break;
    }

    AccountUtils.saveAccounts(accounts, mk);
    return accounts;
  }
};

const deleteKey = (
  keyType: KeyType,
  accounts: LocalAccount[],
  activeAccount: ActiveAccount,
  mk: string,
): LocalAccount[] => {
  const account = accounts.find(
    (account: LocalAccount) => account.name === activeAccount.name,
  );

  if (KeysUtils.keysCount(account?.keys!) > 2) {
    switch (keyType) {
      case KeyType.ACTIVE:
        delete account?.keys.active;
        delete account?.keys.activePubkey;
        break;
      case KeyType.POSTING:
        delete account?.keys.posting;
        delete account?.keys.postingPubkey;
        break;
      case KeyType.MEMO:
        delete account?.keys.memo;
        delete account?.keys.memoPubkey;
        break;
    }
    AccountUtils.saveAccounts(accounts, mk);
    return accounts;
  } else {
    Logger.error('Cannot delete the last key');
    return accounts;
  }
};

const deleteAccount = (
  accountName: string,
  accounts: LocalAccount[],
): LocalAccount[] => {
  return accounts.filter(
    (account: LocalAccount) => account.name !== accountName,
  );
};

const isAccountListIdentical = (
  a: LocalAccount[],
  b: LocalAccount[],
): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};
/* istanbul ignore next */
const downloadAccounts = async (acc: LocalAccount[], mk: string) => {
  const accounts = { list: acc };
  var data = new Blob([await AccountUtils.encryptAccounts(accounts, mk)], {
    type: 'text/plain',
  });
  var url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'accounts.kc';
  a.click();
};

const getAccountValue = (
  {
    sbd_balance,
    balance,
    vesting_shares,
    savings_balance,
    savings_sbd_balance,
    name,
  }: ExtendedAccount,
  prices: CurrencyPrices,
  props: DynamicGlobalProperties,
  // tokensBalance: TokenBalance[],
  // tokensMarket: TokenMarket[],
  accountValueType: AccountValueType,
  // tokens: Token[],
  hiveMarketLockedOpenOrdersValues: HiveInternalMarketLockedInOrders,
  // hiddenTokensList: string[],
) => {
  if (accountValueType === AccountValueType.HIDDEN) return '⁎ ⁎ ⁎';

  if (!prices.steem_dollars?.usd || !prices.steem?.usd) return 0;
  // const userLayerTwoPortfolio = PortfolioUtils.generateUserLayerTwoPortolio(
  //   {
  //     username: name,
  //     tokensBalance: tokensBalance,
  //   },
  //   prices,
  //   tokensMarket,
  //   tokens,
  //   hiddenTokensList,
  // );
  // const layerTwoTokensTotalValue = userLayerTwoPortfolio.reduce(
  //   (acc, curr) => acc + curr.usdValue,
  //   0,
  // );

  const totalLockedValueInHiveMarket =
    hiveMarketLockedOpenOrdersValues.sbd * prices.steem_dollars.usd +
    hiveMarketLockedOpenOrdersValues.steem * prices.steem.usd;

  const dollarValue =
    (parseFloat(sbd_balance as string) +
      parseFloat(savings_sbd_balance as string)) *
      prices.steem_dollars.usd +
    (FormatUtils.toSP(vesting_shares as string, props) +
      parseFloat(balance as string) +
      parseFloat(savings_balance as string)) *
      prices.steem.usd +
    totalLockedValueInHiveMarket;
  const value =
    accountValueType === AccountValueType.DOLLARS
      ? dollarValue
      : dollarValue / prices.steem.usd;

  return FormatUtils.withCommas(value.toString());
};
/* istanbul ignore next */
const getPublicMemo = async (username: string): Promise<string> => {
  const extendedAccounts = await AccountUtils.getAccount(username);
  return extendedAccounts[0].memo_key;
};

const getPowerDown = (
  account: ExtendedAccount,
  globalProperties: DynamicGlobalProperties,
) => {
  const totalSteem = Number(
    globalProperties.total_vesting_fund_steem.toString().split(' ')[0],
  );
  const totalVests = Number(
    globalProperties.total_vesting_shares.toString().split(' ')[0],
  );

  const withdrawn = (
    ((Number(account.withdrawn) / totalVests) * totalSteem) /
    1000000
  ).toFixed(0);

  const total_withdrawing = (
    ((Number(account.to_withdraw) / totalVests) * totalSteem) /
    1000000
  ).toFixed(0);
  const next_vesting_withdrawal = account.next_vesting_withdrawal;
  return [withdrawn, total_withdrawing, next_vesting_withdrawal];
};

const doesAccountExist = async (username: string) => {
  return (await AccountUtils.getAccount(username)).length > 0;
};
/* istanbul ignore next */
const getExtendedAccount = async (
  username: string,
): Promise<ExtendedAccount> => {
  return (await AccountUtils.getExtendedAccounts([username]))[0];
};

const getExtendedAccounts = async (
  usernames: string[],
): Promise<ExtendedAccount[]> => {
  return await SteemTxUtils.getData('condenser_api.get_accounts', [usernames]);
};
/* istanbul ignore next */
const getAccount = async (username: string): Promise<ExtendedAccount[]> => {
  return SteemTxUtils.getData('condenser_api.get_accounts', [[username]]);
};

const getTime = async (username: string): Promise<number> => {
  let balance: number = 0.0000; // Valore di default
  const url = `https://timeapp.foundation/tbalance.php?name=${encodeURIComponent(username)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
//      console.error(`[getTime] HTTP error! Status: ${response.status}`);
      return 0.0000;
    }
    const data = await response.text();
//    console.log(`[getTime] Raw response for ${username}:`, data); // Log per debug
    const bala = parseFloat(data);
	balance = parseFloat(bala.toFixed(5));
	
    if (isNaN(balance)) {
//      console.error(`[getTime] Invalid number format: ${data}`);
      return 0.0000; // Fallback in caso di NaN
    }
//    console.log(`[getTime] Parsed balance:`, balance);
    return balance;
  } catch (error) {
//    console.error(`[getTime] Error fetching balance for ${username}:`, error);
    return 0.0000; // Fallback in caso di errore
  }
};

const getRCMana = async (username: string) => {
  const result = await SteemTxUtils.getData('rc_api.find_rc_accounts', {
    accounts: [username],
  });

  let manabar = result.rc_accounts[0].rc_manabar;
  const max_mana = Number(result.rc_accounts[0].max_rc);

  const delta: number = Date.now() / 1000 - manabar.last_update_time;
  let current_mana = Number(manabar.current_mana) + (delta * max_mana) / 432000;
  let percentage: number = +((current_mana / max_mana) * 100).toFixed(2);

  if (!isFinite(percentage) || percentage < 0) {
    percentage = 0;
  } else if (percentage > 100) {
    percentage = 100;
  }

  return {
    ...result.rc_accounts[0],
    percentage: percentage,
  };
};

/* istanbul ignore next */
const generateQRCode = (account: LocalAccount) => {
  let acc: LocalAccount = { name: account.name, keys: {} };

  if (KeysUtils.isExportable(account.keys.active, account.keys.activePubkey)) {
    acc.keys.active = account.keys.active;
    acc.keys.activePubkey = account.keys.activePubkey;
  }
  if (
    KeysUtils.isExportable(account.keys.posting, account.keys.postingPubkey)
  ) {
    acc.keys.posting = account.keys.posting;
    acc.keys.postingPubkey = account.keys.postingPubkey;
  }
  if (KeysUtils.isExportable(account.keys.memo, account.keys.memoPubkey)) {
    acc.keys.memo = account.keys.memo;
    acc.keys.memoPubkey = account.keys.memoPubkey;
  }
  return JSON.stringify(acc);
};

const claimAccounts = async (
  rc: RC,
  activeAccount: ActiveAccount,
  options?: TransactionOptions,
) => {
  const freeAccountConfig = Config.claims.freeAccount;
  if (
    activeAccount.rc.percentage > freeAccountConfig.MIN_RC_PCT &&
    parseFloat(rc.rc_manabar.current_mana) > freeAccountConfig.MIN_RC
  ) {
    Logger.info(`Claiming free account for @${activeAccount.name}`);

    return SteemTxUtils.sendOperation(
      [
        [
          'claim_account',
          {
            creator: activeAccount.name,
            extensions: [],
            fee: '0.000 STEEM',
          },
        ] as ClaimAccountOperation,
      ],
      activeAccount.keys.active!,
      false,
      options,
    );
  } else Logger.info('Not enough RC% to claim account');
};

const updateAccount = (
  username: string,
  active: Authority | undefined,
  posting: Authority | undefined,
  memo: string,
  stringifiedMetadata: string,
  key: Key,
  options?: TransactionOptions,
) => {
  return SteemTxUtils.sendOperation(
    [
      AccountUtils.getUpdateAccountOperation(
        username,
        active,
        posting,
        memo,
        stringifiedMetadata,
      ),
    ],
    key!,
    false,
    options,
  );
};

const getUpdateAccountOperation = (
  username: string,
  active: Authority | undefined,
  posting: Authority | undefined,
  memo: string,
  stringifiedMetadata: string,
) => {
  return [
    'account_update',
    {
      account: username,
      owner: undefined,
      active,
      posting,
      memo_key: memo,
      json_metadata: stringifiedMetadata,
    },
  ] as AccountUpdateOperation;
};
/* istanbul ignore next */
const getUpdateAccountTransaction = (
  username: string,
  active: Authority | undefined,
  posting: Authority | undefined,
  memo: string,
  stringifiedMetadata: string,
) => {
  return SteemTxUtils.createTransaction([
    AccountUtils.getUpdateAccountOperation(
      username,
      active,
      posting,
      memo,
      stringifiedMetadata,
    ),
  ]);
};

const addAccount = async (username: string, keys: Keys) => {
  const mk = await LocalStorageUtils.getValueFromSessionStorage(
    LocalStorageKeyEnum.__MK,
  );

  const localAccounts = await AccountUtils.getAccountsFromLocalStorage(mk);
  localAccounts.push({ name: username, keys: keys });
  await AccountUtils.saveAccounts(localAccounts, mk);
};

const addMultipleAccounts = async (localAccounts: LocalAccount[]) => {
  const mk = await LocalStorageUtils.getValueFromSessionStorage(
    LocalStorageKeyEnum.__MK,
  );

  let savedAccounts = await AccountUtils.getAccountsFromLocalStorage(mk);
  if (!savedAccounts) savedAccounts = [];
  const newSavedAccounts = [...savedAccounts, ...localAccounts];
  await AccountUtils.saveAccounts(newSavedAccounts, mk);
};

const reorderAccounts = (
  accounts: LocalAccount[],
  start: number,
  end: number,
) => {
  const list = Array.from(accounts);
  const [removed] = list.splice(start, 1);
  list.splice(end, 0, removed);
  return list;
};

const getAccountFromKey = async (key: Key) => {
  const pubKey = KeysUtils.getPublicKeyFromPrivateKeyString(key!.toString());
  const accountName = (await KeysUtils.getKeyReferences([pubKey!]))[0];
  return AccountUtils.getExtendedAccount(accountName[0]);
};

const AccountUtils = {
  verifyAccount,
  getAccountsFromLocalStorage,
  getAccountFromLocalStorage,
  saveAccounts,
  hasStoredAccounts,
  addAuthorizedAccount,
  addKey,
  addMultipleAccounts,
  deleteKey,
  isAccountListIdentical,
  deleteAccount,
  downloadAccounts,
  getKeys,
  getAccountValue,
  getPublicMemo,
  getPowerDown,
  doesAccountExist,
  getExtendedAccount,
  getExtendedAccounts,
  AccountErrorMessages,
  isAccountNameAlreadyExisting,
  getRCMana,
  getAccount,
  generateQRCode,
  encryptAccounts,
  claimAccounts,
  updateAccount,
  getUpdateAccountOperation,
  getUpdateAccountTransaction,
  addAccount,
  reorderAccounts,
  addAuthorizedKey,
  getAccountFromKey,
  getTime,
};

export const BackgroundAccountUtils = {
  getAccountsFromLocalStorage,
};

export default AccountUtils;
