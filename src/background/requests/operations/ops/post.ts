import getMessage from 'src/background/utils/i18n.utils';
import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import { RequestId, RequestPost } from '@interfaces/keychain.interface';
import { TransactionOptions } from '@interfaces/keys.interface';
import { BloggingUtils } from '@popup/steem/utils/blogging.utils';
import { KeychainError } from 'src/keychain-error';
import Logger from 'src/utils/logger.utils';

// TODO : when compatible
export const broadcastPost = async (
  requestHandler: RequestsHandler,
  data: RequestPost & RequestId,
  options?: TransactionOptions,
) => {
  let err, result, err_message;
  const key = requestHandler.data.key;
  try {
    if (data.comment_options === '') {
      result = await BloggingUtils.post(
        data.parent_username || '',
        data.parent_perm,
        data.username,
        data.permlink,
        data.title || '',
        data.body,
        data.json_metadata,
        key!,
      );
    } else {
      result = await BloggingUtils.comment(
        data.parent_username || '',
        data.parent_perm,
        data.username,
        data.permlink,
        data.title || '',
        data.body,
        data.json_metadata,
        data.comment_options,
        key!,
        options,
      );
    }
  } catch (e: any) {
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
      await getMessage('bgd_ops_post'),
      err_message,
    );
    return message;
  }
};
