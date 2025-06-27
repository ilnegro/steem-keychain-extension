import getMessage from 'src/background/utils/i18n.utils';
import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import { encode } from '@hiveio/hive-js/lib/auth/memo';
import {
  KeychainKeyTypes,
  RequestEncode,
  RequestId,
} from '@interfaces/keychain.interface';
import AccountUtils from '@popup/steem/utils/account.utils';
export const encodeMessage = async (
  requestHandler: RequestsHandler,
  data: RequestEncode & RequestId,
) => {
  let encoded = null;
  let error = null;
  try {
    const key = requestHandler.data.key;
    const receiver = await AccountUtils.getExtendedAccount(data.receiver);
    let publicKey;

    if (data.method === KeychainKeyTypes.memo) {
      publicKey = receiver.memo_key;
    } else {
      publicKey = receiver.posting.key_auths[0][0];
    }
    encoded = encode(key, publicKey, data.message);
  } catch (err) {
    error = err;
  } finally {
    return await createMessage(
      error,
      encoded,
      data,
      await getMessage('bgd_ops_encode'),
      await getMessage('bgd_ops_encode_err'),
    );
  }
};
