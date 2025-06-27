import getMessage from 'src/background/utils/i18n.utils';
import {
  addToLoadingList,
  removeFromLoadingList,
} from '@popup/multichain/actions/loading.actions';
import {
  navigateTo,
  navigateToWithParams,
} from '@popup/multichain/actions/navigation.actions';
import { RootState } from '@popup/multichain/store';
import { setAccounts } from '@popup/steem/actions/account.actions';
import { loadActiveAccount } from '@popup/steem/actions/active-account.actions';
import { AccountKeysListItemComponent } from '@popup/steem/pages/app-container/settings/accounts/manage-account/account-keys-list/account-keys-list-item/account-keys-list-item.component';
import { WrongKeysOnUser } from '@popup/steem/pages/app-container/wrong-key-popup/wrong-key-popup.component';
import AccountUtils from '@popup/steem/utils/account.utils';
import { KeysUtils } from '@popup/steem/utils/keys.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import { Screen } from '@reference-data/screen.enum';
import { KeychainKeyTypesLC } from '@steempro/steem-keychain-commons';
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { ConnectedProps, connect } from 'react-redux';
import ButtonComponent, {
  ButtonType,
} from 'src/common-ui/button/button.component';
import { ConfirmationPageParams } from 'src/common-ui/confirmation-page/confirmation-page.component';
import { KeyType } from 'src/interfaces/keys.interface';
import { LocalAccount } from 'src/interfaces/local-account.interface';
import LocalStorageUtils from 'src/utils/localStorage.utils';

interface AccountKeysListProps {
  wrongKeysFound?: WrongKeysOnUser;
}

const AccountKeysList = ({
  wrongKeysFound,
  activeAccount,
  accounts,
  setAccounts,
  loadActiveAccount,
  navigateToWithParams,
  navigateTo,
  addToLoadingList,
  removeFromLoadingList,
}: PropsType & AccountKeysListProps) => {
  const [qrCodeDisplayed, setQRCodeDisplayed] = useState(false);
  const [account, setAccount] = useState<LocalAccount>();
  const [canDeleteKey, setCanDeleteKey] = useState(true);

  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQRCodeDisplayed(false);
    const acc = accounts.find(
      (account: LocalAccount) => account.name === activeAccount.name,
    );
    setAccount(acc!);
    setCanDeleteKey(KeysUtils.keysCount(activeAccount.keys) > 2);
  }, [activeAccount]);

  const isWrongKey = (keyType: KeychainKeyTypesLC) => {
    return (
      wrongKeysFound &&
      wrongKeysFound[activeAccount.name!] &&
      !!wrongKeysFound[activeAccount.name!].find(
        (keyFound) => keyFound === keyType,
      )
    );
  };

  const deleteAccount = () => {
    let warningMessage, warningParams;
    const hasAuthorizedAccountLinkedToActiveAccount = accounts.some((account) =>
      [
        account.keys.activePubkey,
        account.keys.memoPubkey,
        account.keys.postingPubkey,
      ].includes(`@${activeAccount.name}`),
    );
    if (hasAuthorizedAccountLinkedToActiveAccount) {
      warningMessage = 'popup_html_deleting_account_linked_to_authorized';
      warningParams = [activeAccount.name!];
    }
    navigateToWithParams(Screen.CONFIRMATION_PAGE, {
      method: null,
      fields: [],
      message: getMessage(
        'popup_html_delete_account_confirmation_message',
        [activeAccount.name!],
      ),
      title: 'popup_html_delete_account',
      warningMessage: warningMessage,
      warningParams: warningParams,
      afterConfirmAction: async () => {
        addToLoadingList('html_popup_delete_account_operation');
        let newAccounts = AccountUtils.deleteAccount(
          activeAccount.name!,
          accounts,
        );
        let no_key_check = await LocalStorageUtils.getValueFromLocalStorage(
          LocalStorageKeyEnum.NO_KEY_CHECK,
        );
        if (no_key_check && no_key_check.hasOwnProperty(activeAccount.name!)) {
          delete no_key_check[activeAccount.name!];
          if (Object.keys(no_key_check).length === 0) no_key_check = null;
      await LocalStorageUtils.saveValueInLocalStorage(            LocalStorageKeyEnum.NO_KEY_CHECK,
            no_key_check,
          );
        }
        let finalAccounts = [];
        if (hasAuthorizedAccountLinkedToActiveAccount) {
          for (let i = 0; i < newAccounts.length; i++) {
            let tmp = newAccounts[i];
            if (tmp.keys.activePubkey === `@${activeAccount.name}`) {
              delete tmp.keys.activePubkey;
              delete tmp.keys.active;
            }
            if (tmp.keys.postingPubkey === `@${activeAccount.name}`) {
              delete tmp.keys.posting;
              delete tmp.keys.postingPubkey;
            }
            if (tmp.keys.memoPubkey === `@${activeAccount.name}`) {
              delete tmp.keys.memo;
              delete tmp.keys.memoPubkey;
            }

            newAccounts[i] = tmp;

            if (Object.keys(newAccounts[i].keys).length > 0) {
              finalAccounts.push(newAccounts[i]);
            }
          }
        } else {
          finalAccounts = newAccounts;
        }

        setAccounts(finalAccounts);
        if (finalAccounts.length) {
          loadActiveAccount(finalAccounts[0]);
        }
        navigateTo(Screen.HOME_PAGE, true);
        removeFromLoadingList('html_popup_delete_account_operation');
      },
    } as ConfirmationPageParams);
  };

  const toggleQRCode = () => {
    setQRCodeDisplayed(!qrCodeDisplayed);
    setTimeout(() => {
      if (qrCodeRef && qrCodeRef.current) {
        qrCodeRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="account-keys-list">
      <div className="keys-panel">
        <AccountKeysListItemComponent
          privateKey={activeAccount.keys.active}
          publicKey={activeAccount.keys.activePubkey}
          keyName={'popup_html_active'}
          keyType={KeyType.ACTIVE}
          canDelete={canDeleteKey}
          isWrongKey={isWrongKey(KeychainKeyTypesLC.active)}
        />
        <AccountKeysListItemComponent
          privateKey={activeAccount.keys.posting}
          publicKey={activeAccount.keys.postingPubkey}
          keyName={'popup_html_posting'}
          keyType={KeyType.POSTING}
          canDelete={canDeleteKey}
          isWrongKey={isWrongKey(KeychainKeyTypesLC.posting)}
        />
        <AccountKeysListItemComponent
          privateKey={activeAccount.keys.memo}
          publicKey={activeAccount.keys.memoPubkey}
          keyName={'popup_html_memo'}
          keyType={KeyType.MEMO}
          canDelete={canDeleteKey}
          isWrongKey={isWrongKey(KeychainKeyTypesLC.memo)}
        />
      </div>

      <ButtonComponent
        dataTestId="button-toogle-qr-code"
        label={qrCodeDisplayed ? 'popup_html_hide_qr' : 'popup_html_show_qr'}
        onClick={() => toggleQRCode()}
        type={ButtonType.ALTERNATIVE}
      />
      {qrCodeDisplayed && (
        <div className="qr-code">
          <div className="overlay"></div>
          <div className="qr-code-popup">
            <div>
              <h3>{getMessage('popup_html_qr_title')}</h3>
              <div className="qr-code-disclaimer">
                <span>
                  {getMessage('popup_html_qr_disclaimer1') + ' '}
                </span>
                <span>
                  {getMessage('popup_html_qr_disclaimer2')}
                </span>
              </div>
            </div>
            <div className="qr-code-container">
              <div ref={qrCodeRef}></div>
              <QRCode
                data-testid="qrcode"
                className="qrcode"
                size={240}
                value={`keychain://add_account=${AccountUtils.generateQRCode(
                  account!,
                )}`}
                bgColor="var(--qrcode-background-color)"
                fgColor="var(--qrcode-foreground-color)"
              />
            </div>
            <ButtonComponent
              label="popup_html_close"
              onClick={() => setQRCodeDisplayed(false)}
            />
          </div>
        </div>
      )}

      {accounts.length > 1 && (
        <ButtonComponent
          dataTestId="button-delete-account"
          label="popup_html_delete_account"
          type={ButtonType.IMPORTANT}
          onClick={() => deleteAccount()}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
    accounts: state.steem.accounts as LocalAccount[],
  };
};

const connector = connect(mapStateToProps, {
  setAccounts,
  loadActiveAccount,
  navigateToWithParams,
  addToLoadingList,
  removeFromLoadingList,
  navigateTo,
});
type PropsType = ConnectedProps<typeof connector>;

export const AccountKeysListComponent = connector(AccountKeysList);
