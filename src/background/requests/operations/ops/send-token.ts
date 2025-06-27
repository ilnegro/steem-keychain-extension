import getMessage from 'src/background/utils/i18n.utils';
import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import { RequestId, RequestSendToken } from '@interfaces/keychain.interface';
import { TransactionOptions } from '@interfaces/keys.interface';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import TokensUtils from '@popup/steem/utils/tokens.utils';
import { KeychainError } from 'src/keychain-error';

export const broadcastSendToken = async (
  requestHandler: RequestsHandler,
  data: RequestSendToken & RequestId,
  options?: TransactionOptions,
) => {
  let err, err_message, result;
  let key = requestHandler.data.key;
  try {
    switch (KeysUtils.getKeyType(key!)) {
      default: {
        result = await TokensUtils.sendToken(
          data.currency,
          data.to,
          data.amount,
          data.memo,
          key!,
          data.username,
          options,
        );
        break;
      }
    }
  } catch (e: any) {
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
      await getMessage('bgd_ops_tokens'),
      err_message,
    );
    return message;
  }
};
