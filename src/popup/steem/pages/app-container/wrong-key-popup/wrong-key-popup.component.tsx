import getMessage from 'src/background/utils/i18n.utils';
import { LocalAccount } from '@interfaces/local-account.interface';
import { navigateTo } from '@popup/multichain/actions/navigation.actions';
import { RootState } from '@popup/multichain/store';
import { loadActiveAccount } from '@popup/steem/actions/active-account.actions';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import { Screen } from '@reference-data/screen.enum';
import React, { useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ButtonComponent, {
  ButtonType,
} from 'src/common-ui/button/button.component';
import { PopupContainer } from 'src/common-ui/popup-container/popup-container.component';
import LocalStorageUtils from 'src/utils/localStorage.utils';

export interface WrongKeysOnUser {
  [key: string]: string[];
}
interface Props {
  displayWrongKeyPopup: WrongKeysOnUser;
  setDisplayWrongKeyPopup: React.Dispatch<
    React.SetStateAction<WrongKeysOnUser | undefined>
  >;
}

const WrongKeyPopup = ({
  displayWrongKeyPopup,
  setDisplayWrongKeyPopup,
  navigateTo,
  loadActiveAccount,
  accounts,
}: Props & PropsType) => {
  const [accountFound, setaccountFound] = useState(
    Object.keys(displayWrongKeyPopup)[0],
  );
  const [wrongKeysFound, setWrongKeysFound] = useState<string[]>(
    Object.values(displayWrongKeyPopup)[0],
  );

  const skipKeyCheckOnAccount = async () => {
    let prevNoKeyCheck = await LocalStorageUtils.getValueFromLocalStorage(
      LocalStorageKeyEnum.NO_KEY_CHECK,
    );
    if (prevNoKeyCheck) {
      prevNoKeyCheck = { ...displayWrongKeyPopup, ...prevNoKeyCheck };
    }
await LocalStorageUtils.saveValueInLocalStorage(      LocalStorageKeyEnum.NO_KEY_CHECK,
      prevNoKeyCheck ?? displayWrongKeyPopup,
    );
    setDisplayWrongKeyPopup(undefined);
  };

  const loadAccountGotoManage = async () => {
    let actualNoKeyCheck = await LocalStorageUtils.getValueFromLocalStorage(
      LocalStorageKeyEnum.NO_KEY_CHECK,
    );
    if (actualNoKeyCheck && actualNoKeyCheck[accountFound!]) {
      delete actualNoKeyCheck[accountFound!];
    }
await LocalStorageUtils.saveValueInLocalStorage(      LocalStorageKeyEnum.NO_KEY_CHECK,
      actualNoKeyCheck,
    );
    loadActiveAccount(
      accounts.find((account: LocalAccount) => account.name === accountFound!)!,
    );
    navigateTo(Screen.SETTINGS_MANAGE_ACCOUNTS);
  };

  return (
    <PopupContainer className="wrong-key-popup">
      <div className="popup-title">
        {getMessage('html_popup_wrong_key_title', [
          wrongKeysFound.length !== 1 ? 's' : '',
        ])}
      </div>
      <div
        className="caption"
        dangerouslySetInnerHTML={{
          __html: getMessage('html_popup_wrong_key_introduction', [
            accountFound,
            wrongKeysFound.join(', '),
            wrongKeysFound.length !== 1 ? 's' : '',
            wrongKeysFound.length !== 1 ? 's' : '',
          ]),
        }}></div>
      <div className="popup-footer">
        <ButtonComponent
          label="popup_html_wrong_key_popup_do_nothing"
          onClick={skipKeyCheckOnAccount}
          type={ButtonType.ALTERNATIVE}
        />
        <ButtonComponent
          label="popup_html_wrong_key_popup_replace"
          onClick={loadAccountGotoManage}
        />
      </div>
    </PopupContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    accounts: state.steem.accounts,
  };
};

const connector = connect(mapStateToProps, {
  navigateTo,
  loadActiveAccount,
});
type PropsType = ConnectedProps<typeof connector>;

export const WrongKeyPopupComponent = connector(WrongKeyPopup);
