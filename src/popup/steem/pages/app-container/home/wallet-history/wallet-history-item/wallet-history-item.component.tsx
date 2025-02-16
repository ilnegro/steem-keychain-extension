import { Transaction } from '@interfaces/transaction.interface';
import { RootState } from '@popup/multichain/store';
import { WalletTransactionInfoComponent } from '@popup/steem/pages/app-container/home/wallet-history/wallet-history-item/wallet-transaction-info/wallet-transaction-info.component';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

interface WalletHistoryItemProps {
  transaction: Transaction;
  ariaLabel?: string;
}

const WalletHistoryItem = ({ transaction, ariaLabel }: PropsFromRedux) => {
  return (
    <div
      data-testid={ariaLabel}
      id={`index-${transaction.index}`}
      className={`wallet-history-item`}>
      <WalletTransactionInfoComponent
        transaction={transaction}></WalletTransactionInfoComponent>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccountName: state.steem.activeAccount.name,
  };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector> & WalletHistoryItemProps;

export const WalletHistoryItemComponent = connector(WalletHistoryItem);
