import getMessage from 'src/background/utils/i18n.utils';
import {
  KeychainKeyTypesLC,
  RequestEncode,
  RequestId,
} from '@interfaces/keychain.interface';
import { Rpc } from '@interfaces/rpc.interface';
import React from 'react';
import { Separator } from 'src/common-ui/separator/separator.component';
import Operation from 'src/dialog/components/operation/operation';
import RequestItem from 'src/dialog/components/request-item/request-item';

type Props = {
  data: RequestEncode & RequestId;
  domain: string;
  tab: number;
  rpc: Rpc;
};

const EncodeMemo = (props: Props) => {
  const { data } = props;
  return (
    <Operation
      title={getMessage('dialog_title_encode')}
      {...props}
      canWhitelist={data.method.toLowerCase() !== KeychainKeyTypesLC.active}>
      <RequestItem title="dialog_account" content={`@${data.username}`} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem title="dialog_receiver" content={`@${data.receiver}`} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem title="dialog_key" content={data.method} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem title="dialog_message" content={data.message} />
    </Operation>
  );
};

export default EncodeMemo;
