import getMessage from 'src/background/utils/i18n.utils';
import { Proposal } from '@interfaces/proposal.interface';
import { RootState } from '@popup/multichain/store';
import { ProposalItemComponent } from '@popup/steem/pages/app-container/home/governance/proposal-tab/proposal-item/proposal-item.component';
import ProposalUtils from '@popup/steem/utils/proposal.utils';
import ProxyUtils from '@popup/steem/utils/proxy.utils';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import 'react-tabs/style/react-tabs.scss';
import RotatingLogoComponent from 'src/common-ui/rotating-logo/rotating-logo.component';

const ProposalTab = ({ activeAccount, globalProperties }: PropsFromRedux) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [displayingProxyVotes, setDisplayingProxyVotes] = useState(false);

  useEffect(() => {
    initList();
  }, []);

  const initList = async () => {
    setLoading(true);
    let proposals;
    let proxy = await ProxyUtils.findUserProxy(activeAccount.account);
    if (proxy) {
      setDisplayingProxyVotes(true);
    } else {
      setDisplayingProxyVotes(false);
    }
    proposals = await ProposalUtils.getProposalList(
      proxy ?? activeAccount.name!,
      globalProperties.globals!,
    );

    setProposals(proposals);
    setLoading(false);
  };

  const toggleVoteInArray = (id: number) => {
    const proposalsCopy = [...proposals];
    for (let proposal of proposalsCopy) {
      if (proposal.proposalId === id) {
        proposal.voted = !proposal.voted;
        break;
      }
    }
    setProposals(proposalsCopy);
  };

  return (
    <div
      data-testid="proposal-tab"
      className={`proposal-tab ${isLoading ? 'loading' : ''}`}>
      {!isLoading && (
        <>
          {displayingProxyVotes && (
            <div className="using-proxy">
              {getMessage('html_popup_currently_using_proxy', [
                activeAccount.account.proxy,
              ])}
            </div>
          )}
          <div className="proposal-list">
            {proposals.map((proposal) => (
              <ProposalItemComponent
                key={proposal.proposalId}
                proposal={proposal}
                onVoteUnvoteSuccessful={() => toggleVoteInArray(proposal.id)}
              />
            ))}
          </div>
        </>
      )}
      {isLoading && (
        <div className="loading-panel">
          <RotatingLogoComponent></RotatingLogoComponent>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
    globalProperties: state.steem.globalProperties,
  };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const ProposalTabComponent = connector(ProposalTab);
