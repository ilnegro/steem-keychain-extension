import getMessage from 'src/background/utils/i18n.utils';
import { RequestId, RequestPowerUp } from '@interfaces/keychain.interface';
import { Rpc } from '@interfaces/rpc.interface';
import CurrencyUtils from '@popup/steem/utils/currency.utils';
import React from 'react';
import { Separator } from 'src/common-ui/separator/separator.component';
import Operation from 'src/dialog/components/operation/operation';
import RequestItem from 'src/dialog/components/request-item/request-item';
import FormatUtils from 'src/utils/format.utils';

type Props = {
  data: RequestPowerUp & RequestId;
  domain: string;
  tab: number;
  rpc: Rpc;
};

const PowerUp = (props: Props) => {
  const { data, rpc } = props;

  return (
    <Operation
      title={getMessage('dialog_title_powerup')}
      {...props}>
      <RequestItem title="dialog_account" content={`@${data.username}`} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem title="dialog_to" content={`@${data.recipient}`} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem
        title="dialog_amount"
        content={`${FormatUtils.formatCurrencyValue(
          data.steem,
        )} ${CurrencyUtils.getCurrencyLabel('STEEM', rpc.testnet)}`}
      />
    </Operation>
  );
};

export default PowerUp;
