import getMessage from 'src/background/utils/i18n.utils';
import { setInfoMessage } from '@popup/multichain/actions/message.actions';
import {
  goBack,
  navigateToWithParams,
} from '@popup/multichain/actions/navigation.actions';
import { RootState } from '@popup/multichain/store';
import { removeKey, setAccounts } from '@popup/steem/actions/account.actions';
import { loadActiveAccount } from '@popup/steem/actions/active-account.actions';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { ConfirmationPageParams } from 'src/common-ui/confirmation-page/confirmation-page.component';
import { CustomTooltip } from 'src/common-ui/custom-tooltip/custom-tooltip.component';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';
import { Key, KeyType } from 'src/interfaces/keys.interface';
import { LocalAccount } from 'src/interfaces/local-account.interface';
import { Screen } from 'src/reference-data/screen.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';

export interface KeyListItemProps {
  privateKey?: Key;
  publicKey?: Key;
  keyName: string;
  keyType: KeyType;
  canDelete: boolean;
  isWrongKey?: boolean;
}

const SUBSTRING_LENGTH = 15;

const AccountKeysListItem = ({
  privateKey,
  publicKey,
  keyName,
  keyType,
  activeAccount,
  accounts,
  canDelete,
  isWrongKey,
  setInfoMessage,
  navigateToWithParams,
  removeKey,
  goBack,
  loadActiveAccount,
}: PropsType) => {
  const [isPrivateHidden, setIsPrivateHidden] = useState(true);
  const [isAuthorizedAccount, setIsAuthorizedAccount] = useState(false);

  useEffect(() => {
    setIsPrivateHidden(true);
  }, [activeAccount]);

  useEffect(() => {
    if (publicKey) {
      setIsAuthorizedAccount(KeysUtils.isAuthorizedAccount(publicKey));
    }
  }, [publicKey]);

  useEffect(() => {}, [publicKey, privateKey]);

  const copyToClipboard = (key: Key | undefined) => {
    if (key) {
      navigator.clipboard.writeText(key!.toString());
      setInfoMessage('popup_html_copied');
    }
  };

  const removePopupTagForAriaLabel = (keyName: string) => {
    return keyName.includes('popup_html_')
      ? keyName.split('popup_html_')[1]
      : keyName;
  };

  const handleClickOnRemoveKey = () => {
    const keyTypeLabel = getMessage(keyType.toLowerCase());

    navigateToWithParams(Screen.CONFIRMATION_PAGE, {
      method: null,
      message: getMessage('html_popup_delete_key_confirm', [
        keyTypeLabel,
        activeAccount.name!,
      ]),
      fields: [],
      title: 'html_popup_delete_key',
      afterConfirmAction: async () => {
        let actualNoKeyCheck = await LocalStorageUtils.getValueFromLocalStorage(
          LocalStorageKeyEnum.NO_KEY_CHECK,
        );
        if (actualNoKeyCheck && actualNoKeyCheck[activeAccount.name!]) {
          delete actualNoKeyCheck[activeAccount.name!];
        }
    await LocalStorageUtils.saveValueInLocalStorage(          LocalStorageKeyEnum.NO_KEY_CHECK,
          actualNoKeyCheck,
        );
        removeKey(keyType);
        goBack();
      },
    } as ConfirmationPageParams);
  };

  const goToAccount = (publicKey: Key) => {
    const nextAccount = accounts.find(
      (localAccount: LocalAccount) =>
        localAccount.name === publicKey!.toString().split('@')[1],
    );
    if (nextAccount) {
      loadActiveAccount(nextAccount);
    }
  };

  return (
    <div className="account-keys-list-item">
      <div className={`top-panel ${!privateKey && !publicKey ? 'no-key' : ''}`}>
        <div className="key-name-container">
          <span className="key-name">{getMessage(keyName)} </span>
          {isWrongKey && (
            <CustomTooltip
              message="popup_html_wrong_key_tooltip_text"
              position={'bottom'}
              additionalClassName="tool-tip-custom">
              <SVGIcon icon={SVGIcons.GLOBAL_ERROR} />
            </CustomTooltip>
          )}
        </div>
        {publicKey && privateKey && canDelete && (
          <SVGIcon
            dataTestId={`icon-remove-key-${removePopupTagForAriaLabel(
              keyName,
            )}`}
            onClick={() => handleClickOnRemoveKey()}
            icon={SVGIcons.GLOBAL_DELETE}
            className="remove-button"></SVGIcon>
        )}
        {!privateKey && !publicKey && (
          <SVGIcon
            dataTestId={`icon-add-key-${removePopupTagForAriaLabel(keyName)}`}
            onClick={() =>
              navigateToWithParams(Screen.SETTINGS_ADD_KEY, keyType)
            }
            icon={SVGIcons.GLOBAL_ADD_CIRCLE}
            className="add-key-icon"></SVGIcon>
        )}
      </div>

      {(publicKey || privateKey) && (
        <div className="keys-panel-content">
          {!isAuthorizedAccount && (
            <>
              <div
                data-testid={`clickeable-account-key-${removePopupTagForAriaLabel(
                  keyName,
                )}`}
                className={`private-key key-field ${
                  isPrivateHidden ? 'hidden' : 'show'
                }`}
                onClick={() =>
                  isPrivateHidden
                    ? setIsPrivateHidden(false)
                    : copyToClipboard(privateKey)
                }>
                {isPrivateHidden
                  ? getMessage('popup_accounts_reveal_private')
                  : `${privateKey?.substring(
                      SUBSTRING_LENGTH,
                      0,
                    )}...${privateKey?.toString().slice(-SUBSTRING_LENGTH)}`}
              </div>
              <div
                className={`public-key key-field`}
                onClick={() => copyToClipboard(publicKey)}>
                {`${publicKey?.substring(SUBSTRING_LENGTH, 0)}...${publicKey
                  ?.toString()
                  .slice(-SUBSTRING_LENGTH)}`}
              </div>
            </>
          )}
          {isAuthorizedAccount && publicKey && (
            <div
              data-testid="using-authorized-account"
              className="using-authorized-account"
              onClick={() => goToAccount(publicKey)}>
              {getMessage('html_popup_using_authorized_account', [
                publicKey,
              ])}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    accounts: state.steem.accounts as LocalAccount[],
    activeAccount: state.steem.activeAccount,
  };
};

const connector = connect(mapStateToProps, {
  setInfoMessage,
  setAccounts,
  navigateToWithParams,
  removeKey,
  goBack,
  loadActiveAccount,
});
type PropsType = ConnectedProps<typeof connector> & KeyListItemProps;

export const AccountKeysListItemComponent = connector(AccountKeysListItem);
