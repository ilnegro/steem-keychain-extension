import { setTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { AccountKeysListComponent } from '@popup/steem/pages/app-container/settings/accounts/manage-account/account-keys-list/account-keys-list.component';
import { WrongKeysOnUser } from '@popup/steem/pages/app-container/wrong-key-popup/wrong-key-popup.component';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import { Screen } from '@reference-data/screen.enum';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { SelectAccountSectionComponent } from 'src/common-ui/select-account-section/select-account-section.component';

const ManageAccount = ({
  setTitleContainerProperties,
  activeAccount,
  localAccounts,
}: PropsFromRedux) => {
  const [wrongKeysFound, setWrongKeysFound] = useState<
    WrongKeysOnUser | undefined
  >();

  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_manage_accounts',
      isBackButtonEnabled: true,
    });
  }, []);

  useEffect(() => {
    if (activeAccount) {
      const selectedLocalAccount = localAccounts.find(
        (localAccount) => localAccount.name === activeAccount.name!,
      );
      let tempFoundWrongKeys: WrongKeysOnUser;
      tempFoundWrongKeys = { [activeAccount.name!]: [] };
      for (const [key, value] of Object.entries(selectedLocalAccount!.keys)) {
        tempFoundWrongKeys = KeysUtils.checkWrongKeyOnAccount(
          key,
          value,
          activeAccount.name!,
          activeAccount.account,
          tempFoundWrongKeys,
        );
      }
      if (tempFoundWrongKeys[activeAccount.name!].length > 0) {
        setWrongKeysFound(tempFoundWrongKeys);
      } else {
        setWrongKeysFound(undefined);
      }
    }
  }, [activeAccount]);

  return (
    <div
      data-testid={`${Screen.SETTINGS_MANAGE_ACCOUNTS}-page`}
      className="settings-manage-account">
      <SelectAccountSectionComponent background="white" fullSize />
      <AccountKeysListComponent wrongKeysFound={wrongKeysFound} />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
    localAccounts: state.steem.accounts,
  };
};

const connector = connect(mapStateToProps, {
  setTitleContainerProperties,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const ManageAccountComponent = connector(ManageAccount);
