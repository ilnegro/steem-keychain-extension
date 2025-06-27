import getMessage from 'src/background/utils/i18n.utils';
import { FillConvert } from '@interfaces/transaction.interface';
import { GenericTransactionComponent } from '@popup/steem/pages/app-container/home/wallet-history/wallet-history-item/wallet-transaction-info/wallet-transaction-types/generic-transaction/generic-transaction.component';
import React, { useEffect } from 'react';
import 'react-tabs/style/react-tabs.scss';

interface Props {
  transaction: FillConvert;
}

export const FillConvertTransactionComponent = ({ transaction }: Props) => {
  useEffect;
  const getDetail = () => {
    return getMessage(
      'popup_html_wallet_info_fill_convert_request',
      [transaction.amount_in, transaction.amount_out],
    );
  };
  return (
    <GenericTransactionComponent
      transaction={transaction}
      detail={getDetail()}></GenericTransactionComponent>
  );
};
