import MkModule from '@background/mk.module';
import { RequestsHandler } from '@background/requests/request-handler';
import {
  KeychainRequest,
  KeychainRequestTypes,
  RequestTransfer,
} from '@interfaces/keychain.interface';
import { LocalAccount } from '@interfaces/local-account.interface';
import { NoConfirm } from '@interfaces/no-confirm.interface';
import { Rpc } from '@interfaces/rpc.interface';
import EncryptUtils from '@popup/steem/utils/encrypt.utils';
import RpcUtils from '@popup/steem/utils/rpc.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import Config from 'src/config';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import Logger from 'src/utils/logger.utils';
import { isWhitelisted } from 'src/utils/preferences.utils';
import {
  anonymous_requests,
  getRequiredWifType,
} from 'src/utils/requests.utils';
import * as Logic from './logic';

export default async (
  request: KeychainRequest,
  tab: number | undefined,
  domain: string,
  requestHandler: RequestsHandler,
) => {
  const items: {
    accounts?: string;
    current_rpc?: Rpc;
    no_confirm?: NoConfirm;
  } = await LocalStorageUtils.getMultipleValueFromLocalStorage([
    LocalStorageKeyEnum.ACCOUNTS,
    LocalStorageKeyEnum.NO_CONFIRM,
    LocalStorageKeyEnum.CURRENT_RPC,
  ]);

  let rpc = items.current_rpc || Config.rpc.DEFAULT;
  if (request.rpc) {
    const override_rpc = await RpcUtils.findRpc(request.rpc);
    if (override_rpc) {
      rpc = override_rpc;
    }
  }
  const { username, type } = request;
  const mk = await MkModule.getMk();
  Logger.info('Initializing request logic');
  if (!items.accounts && type !== KeychainRequestTypes.addAccount) {
    // Wallet not initialized
    Logic.initializeWallet(requestHandler, tab!, request);
  } else if (!items.accounts && !mk) {
    // Wallet not initialized for adding first account
    Logic.addAccountToEmptyWallet(requestHandler, tab!, request, domain);
  } else if (!mk) {
    // if locked
    Logic.unlockWallet(requestHandler, tab!, request, domain);
  } else {
    const accounts = items.accounts
      ? (EncryptUtils.decryptToJson(items.accounts, mk!).list as LocalAccount[])
      : [];

    await requestHandler.initializeParameters(
      accounts,
      rpc,
      items.no_confirm || {},
    );

    let account = accounts.find((e) => e.name === username);
    if (type === KeychainRequestTypes.addAccount) {
      Logic.addAccountRequest(requestHandler, tab!, request, domain, account);
    } else if (type === KeychainRequestTypes.transfer) {
      Logic.transferRequest(
        requestHandler,
        tab!,
        request as RequestTransfer,
        domain,
        accounts,
        rpc,
        account,
      );
    } else if (anonymous_requests.includes(type) && !username) {
      // if no username specified for anonymous requests
      Logic.anonymousRequests(
        requestHandler,
        tab!,
        request,
        domain,
        accounts,
        rpc,
      );
    } else {
      // Default case
      if (!account) {
        Logic.missingUser(requestHandler, tab!, request, username!);
      } else {
        let typeWif = getRequiredWifType(request);
        let req = request;
        req.key = typeWif;

        if (!account.keys[typeWif]) {
          Logic.missingKey(requestHandler, tab!, request, username!, typeWif);
        } else {
          //@ts-ignore
          const publicKey: Key = account.keys[`${typeWif}Pubkey`]!;
          const key = account.keys[typeWif];
          requestHandler.setKeys(key!, publicKey!);

          if (!isWhitelisted(items.no_confirm || {}, req, domain, rpc)) {
            Logic.requestWithConfirmation(
              requestHandler,
              tab!,
              req,
              domain,
              rpc,
            );
          } else {
            Logic.requestWithoutConfirmation(requestHandler, tab!, req);
          }
        }
      }
    }
  }
  requestHandler.saveInLocalStorage();
};