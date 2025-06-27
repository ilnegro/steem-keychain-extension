import getMessage from 'src/background/utils/i18n.utils';
import { KeychainKeyTypesLC } from '@interfaces/keychain.interface';
import {
  setErrorMessage,
  setSuccessMessage,
} from '@popup/multichain/actions/message.actions';
import { RootState } from '@popup/multichain/store';
import { refreshActiveAccount } from '@popup/steem/actions/active-account.actions';
import ProxyUtils from '@popup/steem/utils/proxy.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import { OperationButtonComponent } from 'src/common-ui/button/operation-button.component';
import LocalStorageUtils from 'src/utils/localStorage.utils';

const ProxySuggestion = ({
  activeAccount,
  isMessageContainerDisplayed,
  setSuccessMessage,
  setErrorMessage,
  refreshActiveAccount,
}: PropsType) => {
  const [forceClosed, setForcedClosed] = useState(false);

  useEffect(() => {
    init();
  }, [activeAccount]);

  const init = async () => {
    if (activeAccount.name) {
      const hideSuggestionProxy =
        await LocalStorageUtils.getValueFromLocalStorage(
          LocalStorageKeyEnum.HIDE_SUGGESTION_PROXY,
        );
      setForcedClosed(
        hideSuggestionProxy ? hideSuggestionProxy[activeAccount.name] : false,
      );
    }
  };

  const handleSetProxy = async () => {
    try {
      const success = await ProxyUtils.setAsProxy(
        'keychain',
        activeAccount.name!,
        activeAccount.keys.active!,
      );
      if (success) {
        if (success.isUsingMultisig) {
          setSuccessMessage('multisig_transaction_sent_to_signers');
        } else {
          setSuccessMessage('popup_success_proxy', ['keychain']);
        }
        refreshActiveAccount();
        handleClose();
      } else {
        setErrorMessage('popup_error_proxy', ['keychain']);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleClose = async () => {
    let hideSuggestionProxy = await LocalStorageUtils.getValueFromLocalStorage(
      LocalStorageKeyEnum.HIDE_SUGGESTION_PROXY,
    );
    if (!hideSuggestionProxy) {
      hideSuggestionProxy = {};
    }
    hideSuggestionProxy[activeAccount.name!] = true;
    setForcedClosed(true);
await LocalStorageUtils.saveValueInLocalStorage(      LocalStorageKeyEnum.HIDE_SUGGESTION_PROXY,
      hideSuggestionProxy,
    );
  };
  return (
    <div
      data-testid="proxy-suggestion"
      className={`proxy-suggestion ${
        isMessageContainerDisplayed || forceClosed ? 'hide' : ''
      }`}>
      <div className="caption">
        {getMessage('popup_html_proxy_suggestion')}
      </div>
      <div className="button-panel">
        <ButtonComponent
          dataTestId="button-panel-close"
          label="popup_html_close"
          onClick={handleClose}></ButtonComponent>
        <OperationButtonComponent
          dataTestId="operation-ok-button"
          requiredKey={KeychainKeyTypesLC.active}
          onClick={handleSetProxy}
          label={'html_popup_set_as_proxy'}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
    isMessageContainerDisplayed: state.message.key.length > 0,
  };
};

const connector = connect(mapStateToProps, {
  setSuccessMessage,
  setErrorMessage,
  refreshActiveAccount,
});
type PropsType = ConnectedProps<typeof connector>;

export const ProxySuggestionComponent = connector(ProxySuggestion);
