import getMessage from 'src/background/utils/i18n.utils';
import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import { RequestId, RequestVote } from '@interfaces/keychain.interface';
import { TransactionOptions } from '@interfaces/keys.interface';
import { BloggingUtils } from '@popup/steem/utils/blogging.utils';
import { KeychainError } from 'src/keychain-error';

export const broadcastVote = async (
  requestHandler: RequestsHandler,
  data: RequestVote & RequestId,
  options?: TransactionOptions,
) => {
  const key = requestHandler.data.key;
  let err, result, err_message;
  try {
    // TODO : When Ledger ready for full usage with posting key, add compatibility with Ledger
    result = await BloggingUtils.vote(
      data.username,
      data.author,
      data.permlink,
      +data.weight,
      key!,
      options,
    );
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
      await getMessage('bgd_ops_vote', [
        data.author,
        data.permlink,
        +data.weight / 100 + '',
      ]),
      err_message,
    );
    return message;
  }
};
