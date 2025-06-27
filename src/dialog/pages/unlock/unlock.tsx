import getMessage from 'src/background/utils/i18n.utils';
import { KeychainRequest } from '@interfaces/keychain.interface';
import { BackgroundCommand } from '@reference-data/background-message-key.enum';
import { DialogCommand } from '@reference-data/dialog-message-key.enum';
import React, { useEffect, useState } from 'react';
import ButtonComponent, {
  ButtonType,
} from 'src/common-ui/button/button.component';
import { InputType } from 'src/common-ui/input/input-type.enum';
import InputComponent from 'src/common-ui/input/input.component';
import { LoadingComponent } from 'src/common-ui/loading/loading.component';
import DialogHeader from 'src/dialog/components/dialog-header/dialog-header.component';

type Props = {
  data: UnlockMessage;
  wrongMk?: boolean;
  index?: number;
};

type UnlockMessage = {
  command: DialogCommand;
  msg: {
    success: false;
    error: 'locked';
    result: null;
    data: KeychainRequest;
    message: string;
    display_msg: string;
  };
  tab: number;
  domain: string;
};
export default ({ data, wrongMk, index }: Props) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [index]);

  const login = () => {
    setLoading(true);
    chrome.runtime.sendMessage({
      command: BackgroundCommand.UNLOCK_FROM_DIALOG,
      value: {
        data,
        tab: data.tab,
        mk: password,
        domain: data.domain,
        request_id: data.msg.data.request_id,
      },
    });
  };

  return (
    <div className="unlock-page">
      <DialogHeader title={getMessage('dialog_header_unlock')} />
      <div className="caption">
        {getMessage('bgd_auth_locked_desc')}
      </div>
      <InputComponent
        value={password}
        onChange={setPassword}
        logo=""
        placeholder="popup_html_password"
        type={InputType.PASSWORD}
        onEnterPress={login}
      />
      {wrongMk && (
        <div className="error">
          {getMessage('dialog_header_wrong_pwd')}
        </div>
      )}
      <div className="fill-space"></div>
      <div className="button-panel">
        <ButtonComponent
          label={'dialog_cancel'}
          type={ButtonType.ALTERNATIVE}
          onClick={() => {
            window.close();
          }}
        />
        <ButtonComponent
          label={'dialog_unlock'}
          onClick={login}
          type={ButtonType.IMPORTANT}
        />
      </div>
      <LoadingComponent hide={!loading} />
    </div>
  );
};
