import getMessage from 'src/background/utils/i18n.utils';
import { setErrorMessage } from '@popup/multichain/actions/message.actions';
import { setMk } from '@popup/multichain/actions/mk.actions';
import { navigateTo } from '@popup/multichain/actions/navigation.actions';
import { resetTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { retrieveAccounts } from '@popup/steem/actions/account.actions';
import { setProcessingDecryptAccount } from '@popup/steem/actions/app-status.actions';
import MkUtils from '@popup/steem/utils/mk.utils';
import React, { useEffect, useRef, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { InputType } from 'src/common-ui/input/input-type.enum';
import InputComponent from 'src/common-ui/input/input.component';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';
import { Screen } from 'src/reference-data/screen.enum';
import EncryptUtils from '@popup/steem/utils/encrypt.utils';

interface SignInProps {
  setIsUnlocked?: (value: boolean) => void;
}

const SignIn = ({
  setErrorMessage,
  setMk,
  navigateTo,
  resetTitleContainerProperties,
  retrieveAccounts,
  setProcessingDecryptAccount,
  setIsUnlocked,
}: PropsFromRedux & SignInProps) => {
  const [password, setPassword] = useState('');
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    resetTitleContainerProperties();
  }, []);

  useEffect(() => {
    if (ref && ref.current) ref.current.focus();
  }, [ref]);

  const login = async () => {
    try {
      // console.log('[SignIn] Attempting to unlock with password:', password);
      if (await MkUtils.login(password)) {
        // console.log('[SignIn] Password correct, unlocking app');
        setProcessingDecryptAccount(true);
        setMk(password, false);
        retrieveAccounts(EncryptUtils.hashPassword(password));
        if (setIsUnlocked) {
          setIsUnlocked(true);
        }
        setProcessingDecryptAccount(false);
        // console.log('[SignIn] Navigating to ACCOUNT_PAGE_INIT_ACCOUNT');
        navigateTo(Screen.ACCOUNT_PAGE_INIT_ACCOUNT, true);
      } else {
        // console.log('[SignIn] Incorrect password');
        setErrorMessage('wrong_password');
      }
    } catch (error) {
      console.error('[SignIn] Error during login:', error);
      setErrorMessage('popup_html_login_error');
      setProcessingDecryptAccount(false);
    }
  };

  const goToForgetPassword = () => {
    // console.log('[SignIn] Navigating to RESET_PASSWORD_PAGE');
    navigateTo(Screen.RESET_PASSWORD_PAGE);
  };

  return (
    <div data-testid="sign-in-page" className="sign-in-page">
      <SVGIcon className="logo-white" icon={SVGIcons.KEYCHAIN_FULL_LOGO} />
      <div className="introduction-panel">
        <span className="introduction big first">
          {getMessage('popup_html_unlock1')}
        </span>
        <span className="introduction medium lighter third">
          {getMessage('popup_html_unlock3')}
        </span>
      </div>

      <InputComponent
        classname="password-input"
        value={password}
        onChange={setPassword}
        label="popup_html_password"
        placeholder="popup_html_password"
        type={InputType.PASSWORD}
        onEnterPress={login}
        dataTestId={'password-input'}
        ref={ref}
      />

      <div className="action-panel">
        <ButtonComponent
          label={'popup_html_signin'}
          onClick={login}
          dataTestId={'login-button'}
        />
        <div
          className="reset-password-link"
          onClick={goToForgetPassword}
          data-testid="reset-password-link">
          {getMessage('popup_html_forgot')}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {
  setErrorMessage,
  setMk,
  navigateTo,
  resetTitleContainerProperties,
  retrieveAccounts,
  setProcessingDecryptAccount,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const SignInComponent = connector(SignIn);