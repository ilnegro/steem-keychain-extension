import getMessage from 'src/background/utils/i18n.utils';
import {
  RequestAddKeyAuthority,
  RequestId,
} from '@interfaces/keychain.interface';
import { Rpc } from '@interfaces/rpc.interface';
import React from 'react';
import { Separator } from 'src/common-ui/separator/separator.component';
import Operation from 'src/dialog/components/operation/operation';
import RequestItem from 'src/dialog/components/request-item/request-item';

type Props = {
  data: RequestAddKeyAuthority & RequestId;
  domain: string;
  tab: number;
  rpc: Rpc;
};

const AddKeyAuthority = (props: Props) => {
  const { data } = props;
  return (
    <Operation
      title={getMessage('dialog_title_add_key_auth')}
      {...props}>
      <RequestItem title="dialog_account" content={`@${data.username}`} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem title="dialog_key" content={data.authorizedKey} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem title="dialog_role" content={data.role} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem title="dialog_weight" content={data.weight + ''} />
    </Operation>
  );
};

export default AddKeyAuthority;
