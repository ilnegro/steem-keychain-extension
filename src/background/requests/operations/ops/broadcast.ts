import getMessage from 'src/background/utils/i18n.utils';
import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import { encode } from '@hiveio/hive-js/lib/auth/memo';
import {
  KeychainKeyTypesLC,
  RequestBroadcast,
  RequestId,
} from '@interfaces/keychain.interface';
import { TransactionOptions } from '@interfaces/keys.interface';
import AccountUtils from '@popup/steem/utils/account.utils';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';
import { Operation } from '@steempro/dsteem';
import { KeychainError } from 'src/keychain-error';
import Logger from 'src/utils/logger.utils';

// Check size of transaction. Might need to signHash

export const broadcastOperations = async (
  requestHandler: RequestsHandler,
  data: RequestBroadcast & RequestId,
  options?: TransactionOptions,
) => {
  let result, err, err_message;
  const key = requestHandler.data.key;

  // check if operations contains any transfer which requires memo encryption
  try {
    let operations: Operation[] =
      typeof data.operations === 'string'
        ? JSON.parse(data.operations)
        : data.operations;

    for (const op of operations) {
      if (op[0] === 'transfer') {
        const memo = op[1].memo;
        if (memo && memo.length > 0 && memo[0] == '#') {
          const receiver = await AccountUtils.getExtendedAccount(op[1].to);
          if (!receiver) {
            throw new KeychainError('bgd_ops_transfer_get_account', [op[1].to]);
          }
          const memoKey: string = requestHandler.getUserKeyPair(
            data.username!,
            KeychainKeyTypesLC.memo,
          )[0];
          if (!memoKey) {
            throw new KeychainError('popup_html_memo_key_missing', []);
          }
          const memoReceiver = receiver.memo_key;
          op[1].memo = encode(memoKey, memoReceiver, memo);
        }
      } else if (
        op[0] === 'update_proposal_votes' ||
        op[0] === 'create_proposal' ||
        op[0] === 'remove_proposal' ||
        op[0] === 'account_update2' ||
        op[0] === 'account_update'
      ) {
        if (!op[1].extensions) {
          op[1].extensions = [];
        }
        if (
          op[0] === 'update_proposal_votes' &&
          typeof op[1].approve === 'string'
        ) {
          op[1].approve = op[1].approve === 'true';
        }
      } else if (op[0] === 'custom_json') {
        if (!op[1].required_posting_auths) {
          op[1].required_posting_auths = [];
        }
        if (!op[1].required_auths) {
          op[1].required_auths = [];
        }
      }
    }

    switch (KeysUtils.getKeyType(key!)) {
      default: {
        result = await SteemTxUtils.sendOperation(
          operations,
          key!,
          false,
          options,
        );
        break;
      }
    }
  } catch (e) {
    Logger.error(e);
    err = (e as KeychainError).trace || e;
    err_message = await getMessage(
      (e as KeychainError).message,
      (e as KeychainError).messageParams,
    );
  } finally {
    const message = await createMessage(
      err,
      result,
      data,
      await getMessage('bgd_ops_broadcast'),
      err_message,
    );
    return message;
  }
};
