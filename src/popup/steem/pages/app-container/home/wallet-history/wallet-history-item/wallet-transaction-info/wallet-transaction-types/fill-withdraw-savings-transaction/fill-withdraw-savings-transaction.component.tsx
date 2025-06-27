import getMessage from 'src/background/utils/i18n.utils';
import {
  StartWithdrawSavings,
  WithdrawSavings,
} from '@interfaces/transaction.interface';
import { RootState } from '@popup/multichain/store';
import { GenericTransactionComponent } from '@popup/steem/pages/app-container/home/wallet-history/wallet-history-item/wallet-transaction-info/wallet-transaction-types/generic-transaction/generic-transaction.component';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import 'react-tabs/style/react-tabs.scss';
import FormatUtils from 'src/utils/format.utils';

interface WithdrawSavingsTransactionProps {
  transaction: WithdrawSavings | StartWithdrawSavings;
}

const FillWithdrawSavingsTransaction = ({
  transaction,
  activeAccountName,
}: PropsFromRedux & WithdrawSavingsTransactionProps) => {
  const getDetail = () => {
    return getMessage(
      'popup_html_wallet_info_fill_withdraw_savings',
      [FormatUtils.withCommas(transaction.amount, 3)],
    );
  };

  return (
    <GenericTransactionComponent
      transaction={transaction}
      detail={getDetail()}></GenericTransactionComponent>
  );
};

const mapStateToProps = (state: RootState) => {
  return { activeAccountName: state.steem.activeAccount.name };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FillWithdrawSavingsTransactionComponent = connector(
  FillWithdrawSavingsTransaction,
);
