import getMessage from 'src/background/utils/i18n.utils';
import { LocalAccount } from '@interfaces/local-account.interface';
import { setErrorMessage } from '@popup/multichain/actions/message.actions';
import { navigateTo } from '@popup/multichain/actions/navigation.actions';
import { setTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { addAccount } from '@popup/steem/actions/account.actions';
import AccountUtils from '@popup/steem/utils/account.utils';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { InputType } from 'src/common-ui/input/input-type.enum';
import InputComponent from 'src/common-ui/input/input.component';
import { Screen } from 'src/reference-data/screen.enum';

const AddByAuth = ({
  setErrorMessage,
  navigateTo,
  localAccounts,
  addAccount,
  setTitleContainerProperties,
}: PropsType) => {
  const [username, setUsername] = useState('');
  const [authorizedAccount, setAuthorizedAccount] = useState('');

  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_setup',
      isBackButtonEnabled: true,
    });
  }, []);

  const submitForm = async (): Promise<void> => {
    if (
      localAccounts
        .map((localAccount: LocalAccount) => localAccount.name)
        .includes(username)
    ) {
      setErrorMessage('popup_html_account_already_existing');
      return;
    }
    try {
      const keys = await AccountUtils.addAuthorizedAccount(
        username.trim(),
        authorizedAccount.trim(),
        localAccounts,
      );
      if (keys && KeysUtils.keysCount(keys) >= 2) {
        addAccount({ name: username, keys: keys });
        navigateTo(Screen.SETTINGS_MAIN_PAGE);
      }
    } catch (err: any) {
      setErrorMessage(err.message, err.messageParams);
    }
  };

  return (
    <div
      data-testid={`${Screen.ACCOUNT_PAGE_ADD_BY_AUTH}-page`}
      className="add-by-auth-page">
      <div className="caption">
        {getMessage('popup_html_auth_text')}
      </div>
      <InputComponent
        dataTestId="input-username"
        value={username}
        onChange={setUsername}
        logo={SVGIcons.INPUT_AT}
        label="popup_html_username"
        placeholder="popup_html_username"
        type={InputType.TEXT}
        onEnterPress={submitForm}
      />
      <InputComponent
        dataTestId="input-authorized-account"
        value={authorizedAccount}
        onChange={setAuthorizedAccount}
        logo={SVGIcons.INPUT_AT}
        label="popup_html_auth_placeholder_username_auth"
        placeholder="popup_html_auth_placeholder_username_auth"
        type={InputType.TEXT}
        onEnterPress={submitForm}
      />
      <div className="fill-space"></div>
      <ButtonComponent
        dataTestId="submit-button"
        label={'popup_html_submit'}
        onClick={submitForm}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    localAccounts: state.steem.accounts,
  };
};

const connector = connect(mapStateToProps, {
  setErrorMessage,
  navigateTo,
  addAccount,
  setTitleContainerProperties,
});
type PropsType = ConnectedProps<typeof connector>;

export const AddByAuthComponent = connector(AddByAuth);
