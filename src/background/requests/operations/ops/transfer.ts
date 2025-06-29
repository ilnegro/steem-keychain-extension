import getMessage from 'src/background/utils/i18n.utils';
import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import { encode } from '@hiveio/hive-js/lib/auth/memo';
import {
  KeychainKeyTypesLC,
  RequestId,
  RequestTransfer,
} from '@interfaces/keychain.interface';
import { TransactionOptions } from '@interfaces/keys.interface';
import AccountUtils from '@popup/steem/utils/account.utils';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import TransferUtils from '@popup/steem/utils/transfer.utils';
import { KeychainError } from 'src/keychain-error';

export const broadcastTransfer = async (
  requestHandler: RequestsHandler,
  data: RequestTransfer & RequestId,
  options?: TransactionOptions,
) => {
  let result,
    err: any,
    err_message = null;
  try {
    const { username, to } = data;
    const memoKey: string = requestHandler.getUserKeyPair(
      username!,
      KeychainKeyTypesLC.memo,
    )[0];
    let memo = data.memo || '';

    const receiver = await AccountUtils.getExtendedAccount(to);

    if (!receiver) {
      throw new KeychainError('bgd_ops_transfer_get_account', [to]);
    }

    if (data.memo && data.memo.length > 0 && data.memo[0] == '#') {
      if (!memoKey) {
        throw new KeychainError('popup_html_memo_key_missing');
      }
      const memoReceiver = receiver.memo_key;
      memo = encode(memoKey, memoReceiver, memo);
    }

    const key = requestHandler.getUserPrivateKey(
      username!,
      KeychainKeyTypesLC.active,
    );
    const keyType = KeysUtils.getKeyType(key!);
    switch (keyType) {
      default: {
        result = await TransferUtils.sendTransfer(
          data.username!,
          data.to,
          data.amount + ' ' + data.currency,
          memo,
          key!,
          options,
        );
        break;
      }
    }
  } catch (e: any) {
    if (typeof e === 'string') {
      const message = await createMessage(
        true,
        null,
        data,
        null,
        await getMessage('bgd_ops_encode_err'),
      );
      return message;
    } else {
      err = (e as KeychainError).trace || e;
      err_message = await getMessage(
        (e as KeychainError).message,
        (e as KeychainError).messageParams,
      );
    }
  } finally {
    const message = await createMessage(
      err,
      result,
      data,
      await getMessage('bgd_ops_transfer_success', [
        data.amount,
        data.currency,
        data.username!,
        data.to,
      ]),
      err_message,
    );
    return message;
  }
};
