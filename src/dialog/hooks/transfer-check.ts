import getMessage from 'src/background/utils/i18n.utils';
import {
  RequestSendToken,
  RequestTransfer,
} from '@interfaces/keychain.interface';
import { Rpc } from '@interfaces/rpc.interface';
import CurrencyUtils, {
  BaseCurrencies,
} from '@popup/steem/utils/currency.utils';
import { getPhishingAccounts } from '@popup/steem/utils/phishing.utils';
import TransferUtils from '@popup/steem/utils/transfer.utils';
import { useEffect, useState } from 'react';

export const useTransferCheck = (
  data: RequestTransfer | RequestSendToken,
  rpc: Rpc,
) => {
  const [header, setHeader] = useState<string | undefined>(undefined);
  useEffect(() => {
    getPhishingAccounts().then((accs: string[]) => {
      let warning;
      if (accs.includes(data.to)) {
        warning = getMessage('popup_warning_phishing', [data.to]);
      } else {
        warning = TransferUtils.getTransferWarning(
          data.to,
          data.type === 'transfer'
            ? CurrencyUtils.getCurrencyLabels(rpc.testnet)[
                data.currency.toLowerCase() as BaseCurrencies
              ]
            : data.currency,
          data.memo,
          accs,
        );
      }
      setHeader(warning ? warning : undefined);
    });
  }, []);
  return header;
};
