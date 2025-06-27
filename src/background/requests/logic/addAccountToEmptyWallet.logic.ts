import getMessage from 'src/background/utils/i18n.utils';
import { createPopup } from '@background/requests/dialog-lifecycle';
import { RequestsHandler } from '@background/requests/request-handler';
import { KeychainRequest } from '@interfaces/keychain.interface';
import { DialogCommand } from '@reference-data/dialog-message-key.enum';

export const addAccountToEmptyWallet = (
  requestHandler: RequestsHandler,
  tab: number,
  request: KeychainRequest,
  domain: string,
) => {
  /* istanbul ignore next */
  createPopup(async () => {
    chrome.runtime.sendMessage({
      command: DialogCommand.REGISTER,
      msg: {
        success: false,
        error: 'register',
        result: null,
        data: request,
        message: await getMessage('popup_html_register'),
        display_msg: await getMessage('popup_html_register'),
      },
      tab,
      domain,
    });
  }, requestHandler);
};
