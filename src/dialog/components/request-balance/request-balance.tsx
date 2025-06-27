import getMessage from 'src/background/utils/i18n.utils';
import { Rpc } from '@interfaces/rpc.interface';
import AccountUtils from '@popup/steem/utils/account.utils';
import CurrencyUtils, {
  BaseCurrencies,
} from '@popup/steem/utils/currency.utils';
import React, { useEffect, useState } from 'react';
import RequestItem from 'src/dialog/components/request-item/request-item';
import FormatUtils from 'src/utils/format.utils';

type Props = {
  amount: number;
  currency: string;
  username?: string;
  rpc: Rpc;
};

const RequestBalance = ({ rpc, username, amount, currency }: Props) => {
  const [balance, setBalance] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const cur = currency.toLowerCase();
  useEffect(() => {
    if (username) {
      init(username);
    }
  }, [username]);

  const init = async (username: string) => {
    const account = await AccountUtils.getExtendedAccount(username);
    const currencyParsed = CurrencyUtils.getCurrencyLabel(
      currency,
      rpc.testnet,
    );
    const currentBalance = FormatUtils.formatCurrencyValue(
      (
        (cur === BaseCurrencies.STEEM
          ? account.balance
          : account.sbd_balance) as string
      ).split(' ')[0],
    );
    const newBalance = FormatUtils.formatCurrencyValue(
      parseFloat(currentBalance.replace(/,/g, '')) - amount,
      3,
    );
    setBalance(`${currentBalance} ${currencyParsed}`);
    setNewBalance(`${newBalance} ${currencyParsed}`);
  };

  return (
    <RequestItem
      title="dialog_balance"
      content={
        balance.length
          ? parseFloat(newBalance) < 0
            ? getMessage('dialog_insufficient_balance')
            : `${balance} => ${newBalance}`
          : '...'
      }
    />
  );
};

export default RequestBalance;
