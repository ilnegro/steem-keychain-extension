import getMessage from 'src/background/utils/i18n.utils';
import { setTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { BuyCoinType } from '@popup/steem/pages/app-container/home/buy-coins/buy-coin-type.enum';
import { BuyCoinsListItem } from '@popup/steem/pages/app-container/home/buy-coins/buy-coins-list-item.list';
import CurrencyUtils from '@popup/steem/utils/currency.utils';
import { Screen } from '@reference-data/screen.enum';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import ButtonComponent, {
  ButtonType,
} from 'src/common-ui/button/button.component';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';
import { SlidingBarComponent } from 'src/common-ui/switch-bar/sliding-bar.component';

const BuyCoins = ({
  setTitleContainerProperties,
  currencyLabels,
  activeAccountName,
}: PropsFromRedux) => {
  const [selectedCurrency, setSelectedCurrency] = useState(
    BuyCoinType.BUY_STEEM,
  );

  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_buy',
      isBackButtonEnabled: true,
    });
  }, []);

  const changeSelectedCurrency = (selectedValue: BuyCoinType) => {
    setSelectedCurrency(selectedValue);
  };

  const goTo = (url: string) => {
    chrome.tabs.create({ url: url });
  };

  return (
    <div
      className="buy-coins-page"
      data-testid={`${Screen.BUY_COINS_PAGE}-page`}>
      <SlidingBarComponent
        dataTestId="buy-coins"
        id="buy-coins"
        onChange={changeSelectedCurrency}
        selectedValue={selectedCurrency}
        values={[
          {
            value: BuyCoinType.BUY_STEEM,
            label: currencyLabels.steem,
            skipLabelTranslation: true,
          },
          {
            value: BuyCoinType.BUY_SBD,
            label: currencyLabels.sbd,
            skipLabelTranslation: true,
          },
        ]}
      />

      <div className="list">
        {BuyCoinsListItem(selectedCurrency, activeAccountName).list.map(
          (item, index) => (
            <div className="card" key={`card-item-${index}`}>
              <SVGIcon icon={item.image} onClick={() => goTo(item.link)} />
              <span className="title">{item.name}</span>
              <span className="description">
                {getMessage(item.description)}
              </span>
              <ButtonComponent
                additionalClass="buy-button"
                onClick={() => goTo(item.link)}
                label={'popup_html_buy'}
                type={ButtonType.IMPORTANT}
              />
            </div>
          ),
        )}
        <div className="card exchanges-card">
          <div className="title">
            {getMessage('html_popup_exchanges')}
          </div>
          <div className="exchange-list">
            {BuyCoinsListItem(
              selectedCurrency,
              activeAccountName,
            ).exchanges.map((item, index) => (
              <div
                className="exchange-item"
                key={`exchange-item-${index}`}
                onClick={() =>
                  goTo(
                    selectedCurrency == BuyCoinType.BUY_SBD
                      ? item.link_sbd!
                      : item.link,
                  )
                }>
                <SVGIcon icon={item.image} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currencyLabels: CurrencyUtils.getCurrencyLabels(
      state.steem.activeRpc?.testnet!,
    ),
    activeAccountName: state.steem.activeAccount.name!,
  };
};

const connector = connect(mapStateToProps, { setTitleContainerProperties });
type PropsFromRedux = ConnectedProps<typeof connector>;

export const BuyCoinsComponent = connector(BuyCoins);
