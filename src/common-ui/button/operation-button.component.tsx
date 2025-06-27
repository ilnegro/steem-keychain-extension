import getMessage from 'src/background/utils/i18n.utils';
import { KeychainKeyTypesLC } from '@interfaces/keychain.interface';
import { setErrorMessage } from '@popup/multichain/actions/message.actions';
import { RootState } from '@popup/multichain/store';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import ButtonComponent, {
  ButtonProps,
} from 'src/common-ui/button/button.component';

type Props = PropsFromRedux & ButtonProps & { requiredKey: KeychainKeyTypesLC };

const OperationButton = ({
  onClick,
  requiredKey,
  activeAccount,
  setErrorMessage,
  ...buttonProps
}: Props) => {
  const handleClick = () => {
    if (requiredKey && !activeAccount.keys[requiredKey]) {
      setErrorMessage('popup_missing_key', [
        getMessage(requiredKey),
      ]);
    } else {
      onClick();
    }
  };

  return <ButtonComponent {...buttonProps} onClick={handleClick} />;
};

const mapStateToProps = (state: RootState) => {
  return { activeAccount: state.steem.activeAccount };
};

const connector = connect(mapStateToProps, { setErrorMessage });
type PropsFromRedux = ConnectedProps<typeof connector>;

export const OperationButtonComponent = connector(OperationButton);
