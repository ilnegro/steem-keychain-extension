import { createMessage } from '@background/requests/operations/operations.utils';
import { RequestsHandler } from '@background/requests/request-handler';
import {
  RequestId,
  RequestPowerDown,
  RequestPowerUp,
} from '@interfaces/keychain.interface';
import { TransactionOptions } from '@interfaces/keys.interface';
import { DynamicGlobalPropertiesUtils } from '@popup/steem/utils/dynamic-global-properties.utils';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import { PowerUtils } from '@popup/steem/utils/power.utils';
import { KeychainError } from 'src/keychain-error';
import Logger from 'src/utils/logger.utils';

export const broadcastPowerUp = async (
  requestHandler: RequestsHandler,
  data: RequestPowerUp & RequestId,
  options?: TransactionOptions,
) => {

  let key = requestHandler.data.key;
  let result, err, err_message;

  try {
    switch (KeysUtils.getKeyType(key!)) {
      default: {
        result = await PowerUtils.powerUp(
          data.username,
          data.recipient,
          `${data.steem} STEEM`,
          key!,
          options,
        );
        break;
      }
    }
  } catch (e) {
    Logger.error(e);
    err = (e as KeychainError).trace || e;
    err_message = await chrome.i18n.getMessage(
      (e as KeychainError).message,
      (e as KeychainError).messageParams,
    );
  } finally {
    const message = await createMessage(
      err,
      result,
      data,
      await chrome.i18n.getMessage('bgd_ops_pu', [data.steem, data.recipient]),
      err_message,
    );
    return message;
  }
};

export const broadcastPowerDown = async (
  requestHandler: RequestsHandler,
  data: RequestPowerDown & RequestId,
  options?: TransactionOptions,
) => {
  let key = requestHandler.data.key;

  let result, err, err_message;
  try {
    const res = await DynamicGlobalPropertiesUtils.getDynamicGlobalProperties();

    let vestingShares = null;
    const totalSteem = res.total_vesting_fund_steem
      ? Number((res.total_vesting_fund_steem as string).split(' ')[0])
      : Number(res.total_vesting_fund_steem.split(' ')[0]);
    const totalVests = Number(
      (res.total_vesting_shares as string).split(' ')[0],
    );
    vestingShares = (parseFloat(data.steem_power) * totalVests) / totalSteem;
    vestingShares = vestingShares.toFixed(6);
    vestingShares = vestingShares.toString() + ' VESTS';

    switch (KeysUtils.getKeyType(key!)) {
      default: {
        result = await PowerUtils.powerDown(
          data.username,
          vestingShares,
          key!,
          options,
        );
        break;
      }
    }
  } catch (e) {
    Logger.error(e);
    err = (e as KeychainError).trace || e;
    err_message = await chrome.i18n.getMessage(
      (e as KeychainError).message,
      (e as KeychainError).messageParams,
    );
  } finally {
    const message = await createMessage(
      err,
      result,
      data,
      parseFloat(data.steem_power) == 0
        ? await chrome.i18n.getMessage('bgd_ops_pd_stop', [data.username])
        : await chrome.i18n.getMessage('bgd_ops_pd', [
            data.steem_power,
            data.username,
          ]),
      err_message,
    );
    return message;
  }
};
