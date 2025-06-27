import getMessage from 'src/background/utils/i18n.utils';
import { createPopup } from '@background/requests/dialog-lifecycle';
import { RequestsHandler } from '@background/requests/request-handler';
import { KeychainRequest } from '@interfaces/keychain.interface';
import { DialogCommand } from '@reference-data/dialog-message-key.enum';

export const unlockWallet = (
  requestHandler: RequestsHandler,
  tab: number,
  request: KeychainRequest,
  domain: string,
) => {
  /* istanbul ignore next */
  createPopup(async () => {
    chrome.runtime.sendMessage({
      command: DialogCommand.UNLOCK,
      msg: {
        success: false,
        error: 'locked',
        result: null,
        data: request,
        message: await getMessage('bgd_auth_locked'),
        display_msg: await getMessage('bgd_auth_locked_desc'),
      },
      tab,
      domain,
    });
  }, requestHandler);
};
