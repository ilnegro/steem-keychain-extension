import getMessage from 'src/background/utils/i18n.utils';
import { KeychainRequest } from '@interfaces/keychain.interface';
import { isPasswordValid } from '@popup/steem/utils/password.utils';
import { BackgroundCommand } from '@reference-data/background-message-key.enum';
import { DialogCommand } from '@reference-data/dialog-message-key.enum';
import React, { useState } from 'react';
import ButtonComponent from 'src/common-ui/button/button.component';
import { InputType } from 'src/common-ui/input/input-type.enum';
import InputComponent from 'src/common-ui/input/input.component';
import DialogHeader from 'src/dialog/components/dialog-header/dialog-header.component';

type Props = {
  data: RegisterMessage;
};

type RegisterMessage = {
  command: DialogCommand.REGISTER;
  msg: {
    success: false;
    error: 'register';
    result: null;
    data: KeychainRequest;
    message: string;
    display_msg: string;
  };
  tab: number;
  domain: string;
};

const Register = ({ data }: Props) => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [signupError, setSignupError] = useState('');

  const signup = () => {
    if (password === password2) {
      if (isPasswordValid(password)) {
        chrome.runtime.sendMessage({
          command: BackgroundCommand.REGISTER_FROM_DIALOG,
          value: {
            data: data.msg.data,
            tab: data.tab,
            mk: password,
            domain: data.domain,
            request_id: data.msg.data.request_id,
          },
        });
      } else {
        setSignupError(getMessage('popup_password_regex'));
      }
    } else {
      setSignupError(getMessage('popup_password_mismatch'));
    }
  };

  return (
    <div className="register-page">
      <DialogHeader title={getMessage('dialog_header_register')} />
      <div
        className="caption"
        dangerouslySetInnerHTML={{
          __html: getMessage('popup_html_register'),
        }}></div>
      <InputComponent
        value={password}
        onChange={setPassword}
        placeholder="popup_html_password"
        type={InputType.PASSWORD}
      />
      <InputComponent
        value={password2}
        onChange={setPassword2}
        placeholder="popup_html_confirm"
        type={InputType.PASSWORD}
        onEnterPress={signup}
      />
      <p>{signupError}</p>
      <ButtonComponent label={'popup_html_submit'} onClick={signup} />
    </div>
  );
};

export default Register;
