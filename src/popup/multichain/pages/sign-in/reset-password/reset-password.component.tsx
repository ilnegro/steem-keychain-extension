import getMessage from 'src/background/utils/i18n.utils';
import { setHasFinishedSignup } from '@popup/multichain/actions/has-finished-signup.actions';
import { forgetMk } from '@popup/multichain/actions/mk.actions';
import { navigateTo } from '@popup/multichain/actions/navigation.actions';
import { setTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { resetAccount } from '@popup/steem/actions/account.actions';
import { resetActiveAccount } from '@popup/steem/actions/active-account.actions';
import { Screen } from '@reference-data/screen.enum';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import LocalStorageUtils from 'src/utils/localStorage.utils';

const ResetPasswordPage = ({
  setTitleContainerProperties,
  navigateTo,
  resetAccount,
  forgetMk,
  resetActiveAccount,
  setHasFinishedSignup,
}: PropsFromRedux) => {
  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_reset',
      isBackButtonEnabled: true,
    });
  }, []);

  const reset = async () => {
    resetAccount();
    setHasFinishedSignup(false);
    forgetMk();
    resetActiveAccount();
    await LocalStorageUtils.clearLocalStorage();
    navigateTo(Screen.SIGN_UP_PAGE, true);
  };

  return (
    <div className="reset-password-page">
      <div className="confirmation-top">
        <p
          className="introduction"
          dangerouslySetInnerHTML={{
            __html: getMessage('popup_html_reset_desc'),
          }}></p>
      </div>

      <div className="fill-space"></div>

      <ButtonComponent
        dataTestId="reset-password-confirm-button"
        label="popup_html_confirm"
        onClick={() => reset()}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {
  setTitleContainerProperties,
  navigateTo,
  resetAccount,
  forgetMk,
  resetActiveAccount,
  setHasFinishedSignup,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const ResetPasswordPageComponent = connector(ResetPasswordPage);
