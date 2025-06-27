import getMessage from 'src/background/utils/i18n.utils';
import {
  RequestId,
  RequestUpdateProposalVote,
} from '@interfaces/keychain.interface';
import { Rpc } from '@interfaces/rpc.interface';
import React from 'react';
import { Separator } from 'src/common-ui/separator/separator.component';
import Operation from 'src/dialog/components/operation/operation';
import RequestItem from 'src/dialog/components/request-item/request-item';

type Props = {
  data: RequestUpdateProposalVote & RequestId;
  domain: string;
  tab: number;
  rpc: Rpc;
};

const UpdateProposalVote = (props: Props) => {
  const { data } = props;
  return (
    <Operation
      title={getMessage('dialog_title_vote_proposal')}
      {...props}>
      <RequestItem title="dialog_account" content={`@${data.username}`} />
      <Separator type={'horizontal'} fullSize />
      <RequestItem
        title="dialog_proposal_ids"
        content={
          typeof data.proposal_ids === 'string'
            ? JSON.parse(data.proposal_ids).join(', ')
            : data.proposal_ids.join(', ')
        }
      />
      <Separator type={'horizontal'} fullSize />
      <RequestItem
        title="dialog_approve"
        content={
          data.approve
            ? getMessage('common_yes')
            : getMessage('common_no')
        }
      />
    </Operation>
  );
};

export default UpdateProposalVote;
