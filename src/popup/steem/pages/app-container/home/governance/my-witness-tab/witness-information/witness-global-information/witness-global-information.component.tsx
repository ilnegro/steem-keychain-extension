import getMessage from 'src/background/utils/i18n.utils';
import { WitnessInfo } from '@interfaces/witness.interface';
import { RootState } from '@popup/multichain/store';
import { WitnessInfoDataComponent } from '@popup/steem/pages/app-container/home/governance/my-witness-tab/witness-information/witness-info-data/witness-info-data.component';
import CurrencyUtils from '@popup/steem/utils/currency.utils';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import 'react-tabs/style/react-tabs.scss';

interface WitnessGlobalInformationProps {
  witnessInfo: WitnessInfo;
}

const WitnessGlobalInformation = ({
  witnessInfo,
  currencyLabels,
}: PropsFromRedux & WitnessGlobalInformationProps) => {
  const gotoUrl = (url: string) => {
    window.open(url);
  };

  return (
    <div className="witness-global-information">
      <div className="info-panel">
        <WitnessInfoDataComponent
          label={'html_popup_witness_global_information_votes_label'}
          value={witnessInfo.votesCount}
        />
        <WitnessInfoDataComponent
          label={'html_popup_witness_information_votes_label'}
          value={`${witnessInfo.voteValueInSP} ${currencyLabels.sp}`}
        />
        <WitnessInfoDataComponent
          label={'html_popup_witness_global_information_blocks_missed_label'}
          value={witnessInfo.blockMissed}
        />
        <WitnessInfoDataComponent
          label={'html_popup_witness_global_information_last_block_label'}
          value={witnessInfo.lastBlock}
          valueOnClickAction={() => gotoUrl(witnessInfo.lastBlockUrl)}
        />
        <WitnessInfoDataComponent
          label={'html_popup_witness_global_information_price_feed_label'}
          value={witnessInfo.priceFeed}
          extraInfo={getMessage(
            'html_popup_witness_global_information_updated_label',
            [witnessInfo.priceFeedUpdatedAt.fromNow()],
          )}
          extraInfoAdditionalClass={`info-last-update ${
            witnessInfo.priceFeedUpdatedAtWarning ? 'warning-red-color' : ''
          }`}
        />
        <WitnessInfoDataComponent
          label={'html_popup_witness_global_information_version_label'}
          value={witnessInfo.version}
        />
      </div>
{/* 
      <div className="witness-rewards-panel">
        <div className="title">
          {getMessage(
            'popup_html_witness_information_rewards_label',
          )}
        </div>
        <div className="rewards-row">
          <div className="label">
            {getMessage(
              'popup_html_witness_information_reward_panel_last_week_label',
            )}
          </div>
          <div className="hp-value">{witnessInfo.rewards.lastWeekInSP}</div>
          <div className="usd-value">
            ≈ ${witnessInfo.rewards.lastWeekInUSD}
          </div>
        </div>
        <div className="rewards-row">
          <div className="label">
            {getMessage(
              'popup_html_witness_information_reward_panel_last_month_label',
            )}
          </div>
          <div className="hp-value">{witnessInfo.rewards.lastMonthInSP}</div>
          <div className="usd-value">
            ≈ ${witnessInfo.rewards.lastMonthInUSD}
          </div>
        </div>
      </div> */}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
    currencyPrices: state.steem.currencyPrices,
    currencyLabels: CurrencyUtils.getCurrencyLabels(
      state.steem.activeRpc?.testnet!,
    ),
    globalProperties: state.steem.globalProperties,
  };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const WitnessGlobalInformationComponent = connector(
  WitnessGlobalInformation,
);
