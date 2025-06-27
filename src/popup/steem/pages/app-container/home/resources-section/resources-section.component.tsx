import getMessage from 'src/background/utils/i18n.utils';
import { RootState } from '@popup/multichain/store';
import { ResourceItemComponent } from '@popup/steem/pages/app-container/home/resources-section/resource-item/resource-item.component';
import SteemUtils from '@popup/steem/utils/steem.utils';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { SVGIcons } from 'src/common-ui/icons.enum';

const ResourcesSection = ({
  activeAccount,
  globalProperties,
}: PropsFromRedux) => {
  const [votingMana, setVotingMana] = useState('--');
  const [votingValue, setVotingValue] = useState<any>();
  const [rc, setRc] = useState('--');
  const [manaReadyIn, setManaReadyIn] = useState('');
  const [rcReadyIn, setRcReadyIn] = useState('');

  useEffect(() => {
    if (
      activeAccount?.account?.voting_manabar?.current_mana !== undefined &&
      activeAccount.rc?.percentage !== undefined
    ) {
      const hasMana =
        activeAccount?.account?.voting_manabar?.current_mana !== 0;

      const mana = SteemUtils.getVP(activeAccount.account);
      const manaValue = SteemUtils.getVotingDollarsPerAccount(
        100,
        globalProperties,
        activeAccount.account,
        false,
      ) as string;
      const voting = parseFloat(manaValue);
      const resources = activeAccount.rc.percentage;

      if (hasMana) {
        setVotingMana(mana?.toFixed(2)!);
        setVotingValue(`$${voting.toFixed(2)}`);
      } else {
        setVotingMana('--');
        setVotingValue(null);
      }

      setRc(resources.toFixed(2));

      setManaReadyIn(
        hasMana
          ? SteemUtils.getTimeBeforeFull(mana!)
          : getMessage('html_popup_voting_no_hp'),
      );
      setRcReadyIn(SteemUtils.getTimeBeforeFull(resources));
    }
  }, [activeAccount]);

  return (
    <div className="resources-section">
      <ResourceItemComponent
        ariaLabel="resource-item-voting-mana"
        label={'popup_html_vm'}
        value={`${votingMana}%`}
        secondaryValue={votingValue}
        icon={SVGIcons.RESOURCE_ITEM_MANA}
        tooltipText={manaReadyIn}
        additionalClass="blue"
      />
      <ResourceItemComponent
        ariaLabel="resource-item-resource-credits"
        label={'popup_html_rc'}
        value={`${rc}%`}
        icon={SVGIcons.RESOURCE_ITEM_RC}
        tooltipText={rcReadyIn}
        additionalClass="red"
      />
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

export const ResourcesSectionComponent = connector(ResourcesSection);
