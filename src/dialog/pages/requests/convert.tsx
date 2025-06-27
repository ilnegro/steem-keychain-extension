import getMessage from 'src/background/utils/i18n.utils';
import { RequestConvert, RequestId } from '@interfaces/keychain.interface';
import { Rpc } from '@interfaces/rpc.interface';
import CurrencyUtils from '@popup/steem/utils/currency.utils';
import React from 'react';
import { Separator } from 'src/common-ui/separator/separator.component';
import Operation from 'src/dialog/components/operation/operation';
import RequestItem from 'src/dialog/components/request-item/request-item';
import FormatUtils from 'src/utils/format.utils';

type Props = {
  data: RequestConvert & RequestId;
  domain: string;
  tab: number;
  rpc: Rpc;
};

const Convert = (props: Props) => {
  const { data, rpc } = props;
  const unit = CurrencyUtils.getCurrencyLabel(
    data.collaterized ? 'STEEM' : 'SBD',
    rpc.testnet,
  );
  return (
    <Operation
      title={getMessage(
        data.collaterized
          ? 'popup_html_proposal_funded_option_hive'
          : 'popup_html_proposal_funded_option_hbd',
      )}
      header={
        data.collaterized
          ? getMessage(`popup_html_convert_hive_intro`, [
              data.amount,
            ])
          : getMessage(`popup_html_convert_hbd_intro`)
      }
      {...props}>
      <RequestItem title="dialog_account" content={`@${data.username}`} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem
        title="dialog_amount"
        content={`${FormatUtils.formatCurrencyValue(data.amount)} ${unit}`}
      />
    </Operation>
  );
};

export default Convert;
