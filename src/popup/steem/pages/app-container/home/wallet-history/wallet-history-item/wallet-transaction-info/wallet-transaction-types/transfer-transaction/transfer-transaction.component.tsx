import getMessage from 'src/background/utils/i18n.utils';
import { Transfer } from '@interfaces/transaction.interface';
import { RootState } from '@popup/multichain/store';
import { GenericTransactionComponent } from '@popup/steem/pages/app-container/home/wallet-history/wallet-history-item/wallet-transaction-info/wallet-transaction-types/generic-transaction/generic-transaction.component';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import 'react-tabs/style/react-tabs.scss';
import FormatUtils from 'src/utils/format.utils';

interface TransferTransactionProps {
  transaction: Transfer;
}

const TransferTransaction = ({
  transaction,
  activeAccountName,
}: PropsFromRedux & TransferTransactionProps) => {
  const getDetail = () => {
    return getMessage(
      activeAccountName === transaction.from
        ? 'popup_html_wallet_info_transfer_out'
        : 'popup_html_wallet_info_transfer_in',
      [
        FormatUtils.withCommas(transaction.amount, 3),
        activeAccountName === transaction.from
          ? transaction.to
          : transaction.from,
      ],
    );
  };

  return (
    <GenericTransactionComponent
      transaction={transaction}
      detail={getDetail()}
      expandableContent={transaction.memo}></GenericTransactionComponent>
  );
};

const mapStateToProps = (state: RootState) => {
  return { activeAccountName: state.steem.activeAccount.name };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const TransferTransactionComponent = connector(TransferTransaction);
