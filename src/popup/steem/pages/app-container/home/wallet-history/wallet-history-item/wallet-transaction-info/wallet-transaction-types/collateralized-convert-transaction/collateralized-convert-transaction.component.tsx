import getMessage from 'src/background/utils/i18n.utils';
import { CollateralizedConvert } from '@interfaces/transaction.interface';
import { GenericTransactionComponent } from '@popup/steem/pages/app-container/home/wallet-history/wallet-history-item/wallet-transaction-info/wallet-transaction-types/generic-transaction/generic-transaction.component';
import React, { useEffect } from 'react';
import 'react-tabs/style/react-tabs.scss';

interface Props {
  transaction: CollateralizedConvert;
}

export const CollateralizedConvertTransactionComponent = ({
  transaction,
}: Props) => {
  useEffect;
  const getDetail = () => {
    return getMessage(
      'popup_html_wallet_info_collateralized_convert',
      [transaction.amount],
    );
  };
  return (
    <GenericTransactionComponent
      transaction={transaction}
      detail={getDetail()}></GenericTransactionComponent>
  );
};
