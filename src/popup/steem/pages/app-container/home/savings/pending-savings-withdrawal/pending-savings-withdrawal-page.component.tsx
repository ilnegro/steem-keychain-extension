import getMessage from 'src/background/utils/i18n.utils';
import { SavingsWithdrawal } from '@interfaces/savings.interface';
import { setTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { PendingSavingsWithdrawalItemComponent } from '@popup/steem/pages/app-container/home/savings/pending-savings-withdrawal/pending-savings-withdrawal-item/pending-savings-withdrawal-item.component';
import { Screen } from '@reference-data/screen.enum';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Separator } from 'src/common-ui/separator/separator.component';

export interface PendingSavingsWithdrawalProps {
  currentWithdrawLabel?: string;
  currency: string;
  savingsPendingWithdrawalList: SavingsWithdrawal[];
}

const PendingSavingsWithdrawal = ({
  savingsPendingWithdrawalList,
  currency,
  setTitleContainerProperties,
}: PropsFromRedux & PendingSavingsWithdrawalProps) => {
  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_savings_current_withdrawing',
      isBackButtonEnabled: true,
    });
  });

  return (
    <div
      className="pending-savings-withdrawal-page"
      data-testid={`${Screen.PENDING_SAVINGS_WITHDRAWAL_PAGE}-page`}>
      <div className="list-panel">
        <div className="pending-disclaimer">
          {getMessage('popup_html_withdraw_savings_until_message', [
            currency,
          ])}
        </div>
        <Separator type="horizontal" />
        <div className="list">
          {savingsPendingWithdrawalList.map((currentWithdrawItem) => {
            return (
              <PendingSavingsWithdrawalItemComponent
                key={currentWithdrawItem.request_id}
                item={currentWithdrawItem}
                currency={currency}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    savingsPendingWithdrawalList: state.navigation.stack[0].params
      .savingsPendingWithdrawalList as SavingsWithdrawal[],
    currency: state.navigation.stack[0].params.currency as string,
  };
};

const connector = connect(mapStateToProps, {
  setTitleContainerProperties,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const PendingSavingsWithdrawalPageComponent = connector(
  PendingSavingsWithdrawal,
);
