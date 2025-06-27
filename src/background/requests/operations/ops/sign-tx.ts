import getMessage from 'src/background/utils/i18n.utils';
import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import { RequestId, RequestSignTx } from '@interfaces/keychain.interface';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';
import { KeychainError } from 'src/keychain-error';

import Logger from 'src/utils/logger.utils';

export const signTx = async (
  requestHandler: RequestsHandler,
  data: RequestSignTx & RequestId,
) => {
  let key = requestHandler.data.key;
  let result, err, err_message;

  const transaction = data.tx;
  if (!transaction.extensions) {
    transaction.extensions = [];
  }
  if (typeof transaction.expiration !== 'string') {
    transaction.expiration = (transaction.expiration as Date).toISOString();
  }

  transaction.expiration = transaction.expiration.split('.')[0];

  try {
    switch (KeysUtils.getKeyType(key!)) {
      default: {
        result = await SteemTxUtils.signTransaction(transaction, key!);
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
    const message = createMessage(
      err,
      result,
      data,
      await getMessage('bgd_ops_sign_tx'),
      err_message,
    );
    return message;
  }
};
