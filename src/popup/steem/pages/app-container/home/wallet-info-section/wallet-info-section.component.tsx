import getMessage from 'src/background/utils/i18n.utils';
import { Conversion } from '@interfaces/conversion.interface';
import { navigateTo } from '@popup/multichain/actions/navigation.actions';
import { RootState } from '@popup/multichain/store';
import { fetchConversionRequests } from '@popup/steem/actions/conversion.actions';
import {
  loadPendingUnstaking,
  loadTokens,
  loadTokensMarket,
  loadUserTokens,
} from '@popup/steem/actions/token.actions';
import { WalletInfoSectionItemComponent } from '@popup/steem/pages/app-container/home/wallet-info-section/wallet-info-section-item/wallet-info-section-item.component';
import ActiveAccountUtils from '@popup/steem/utils/active-account.utils';
import CurrencyUtils from '@popup/steem/utils/currency.utils';
import { Asset as CommonAsset } from '@steempro/steem-keychain-commons';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { SVGIcons } from 'src/common-ui/icons.enum';
import FormatUtils from 'src/utils/format.utils';
import AccountUtils from '@popup/steem/utils/account.utils';

const WalletInfoSection = ({
  activeAccount,
  currencyLabels,
  globalProperties,
  conversions,
  // userTokens,
  // market,
  // allTokens,
  fetchConversionRequests,
}: // loadTokensMarket,
// navigateTo,
// loadUserTokens,
// loadTokens,
// loadPendingUnstaking,
PropsFromRedux) => {
  const [delegationAmount, setDelegationAmount] = useState<string | number>(
    '...',
  );
  const [timeBalance, setTimeBalance] = useState<number>(0); // Stato per il balance di TIME
  const [timeLoading, setTimeLoading] = useState(true); // Stato per il caricamento
  
  // const [filteredTokenList, setFilteredTokenList] = useState<TokenBalance[]>();
  // const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);
  // const [tokenFilter, setTokenFilter] = useState('');
  // const [showSearchHE, setShowSearchHE] = useState(false);
  // const inputRef = useRef<HTMLInputElement>(null);

  // const loadHiddenTokens = async () => {
  //   setHiddenTokens(
  //     (await LocalStorageUtils.getValueFromLocalStorage(
  //       LocalStorageKeyEnum.HIDDEN_TOKENS,
  //     )) ?? [],
  //   );
  // };

  useEffect(() => {
    if (activeAccount && !ActiveAccountUtils.isEmpty(activeAccount)) {
      // loadHiddenTokens();
      // loadTokens();
      // loadTokensMarket();
      // loadUserTokens(activeAccount.name!);
      loadPendingUnstaking(activeAccount.name!);
      fetchConversionRequests(activeAccount.name!);

      const delegatedVestingShares = parseFloat(
        activeAccount.account.delegated_vesting_shares
          .toString()
          .replace(' VESTS', ''),
      );
      const receivedVestingShares = parseFloat(
        activeAccount.account.received_vesting_shares
          .toString()
          .replace(' VESTS', ''),
      );
      const delegationVestingShares = (
        receivedVestingShares - delegatedVestingShares
      ).toFixed(3);

      const delegation = FormatUtils.toSP(
        delegationVestingShares,
        globalProperties.globals,
      );
      setDelegationAmount(delegation);

        const fetchTimeBalance = async () => {
        try {
          setTimeLoading(true);
          const balance = await AccountUtils.getTime(activeAccount.name!);
          setTimeBalance(balance);
        } catch (err) {
          setTimeBalance(0);
        } finally {
          setTimeLoading(false);
        }
      };
      fetchTimeBalance();

    }
  }, [activeAccount.name]);
  

  // useEffect(() => {
  //   if (userTokens.loading) {
  //     // addToLoadingList('html_popup_loading_tokens_operation');
  //   } else if (userTokens.list && market.length) {
  //     // removeFromLoadingList('html_popup_loading_tokens_operation');
  //     const orderedFiltered = userTokens.list
  //       .filter((token) => !hiddenTokens.includes(token.symbol))
  //       .sort(
  //         (a, b) =>
  //           TokensUtils.getHiveEngineTokenValue(
  //             b,
  //             market,
  //             undefined,
  //             allTokens,
  //           ) -
  //           TokensUtils.getHiveEngineTokenValue(
  //             a,
  //             market,
  //             undefined,
  //             allTokens,
  //           ),
  //       );
  //     setFilteredTokenList(orderedFiltered);
  //   }
  // }, [userTokens, market]);

  useEffect(() => {
    const pendingSbdConversions = conversions.filter((conv: Conversion) => {
      return CommonAsset.fromString(conv.amount).symbol === 'SBD';
    });
    if (pendingSbdConversions.length > 0) {
      // setHbdRowInfoContent(
      //   getMessage('popup_html_pending_conversions', [
      //     pendingHbdConversions.length.toString(),
      //     'STEEM',
      //   ]),
      // );
    }

    const pendingHiveConversions = conversions.filter((conv: Conversion) => {
      return CommonAsset.fromString(conv.amount).symbol === 'STEEM';
    });

    if (pendingHiveConversions.length > 0) {
      // setHiveRowInfoContent(
      //   getMessage('popup_html_pending_conversions', [
      //     pendingHiveConversions.length.toString(),
      //     'STEEM',
      //   ]),
      // );
    }
  }, [conversions]);

  return (
    <div className="wallet-info-wrapper">
      <div className="wallet-background" />
      <div className="wallet-info-section">
        <WalletInfoSectionItemComponent
          tokenSymbol="STEEM"
          icon={SVGIcons.WALLET_STEEM_LOGO}
          mainValue={activeAccount.account.balance}
          mainValueLabel={currencyLabels.steem}
          subValue={activeAccount.account.savings_balance}
          subValueLabel={getMessage('popup_html_wallet_savings')}
        />
        <WalletInfoSectionItemComponent
          tokenSymbol="SBD"
          icon={SVGIcons.WALLET_SBD_LOGO}
          mainValue={activeAccount.account.sbd_balance}
          mainValueLabel={currencyLabels.sbd}
          subValue={activeAccount.account.savings_sbd_balance}
          subValueLabel={getMessage('popup_html_wallet_savings')}
        />
        <WalletInfoSectionItemComponent
          tokenSymbol="SP"
          icon={SVGIcons.WALLET_SP_LOGO}
          mainValue={FormatUtils.toSP(
            activeAccount.account.vesting_shares as string,
            globalProperties.globals,
          )}
          mainValueLabel={currencyLabels.sp}
          subValue={delegationAmount}
          subValueLabel={
            getMessage('popup_html_delegations').length <= 5
              ? getMessage('popup_html_delegations')
              : getMessage('popup_html_delegations').slice(0, 5) +
                '.'
          }
        />
        <WalletInfoSectionItemComponent
          tokenSymbol="TIME"
          icon={SVGIcons.WALLET_TIME_LOGO}
		  mainValue={timeLoading ? '...' : timeBalance}
          mainValueLabel={currencyLabels.time}
        />		
        {/* <div className="hive-engine-separator">
          <span>
            <SVGIcon icon={SVGIcons.STEEM_ENGINE} className="no-pointer" />
          </span>
          <div className="line" />

          <InputComponent
            classname={`token-searchbar ${showSearchHE ? '' : 'hide'}`}
            type={InputType.TEXT}
            placeholder="popup_html_search"
            onChange={(e) => {
              setTokenFilter(e);
            }}
            value={tokenFilter}
            rightActionIcon={SVGIcons.WALLET_SEARCH}
            rightActionClicked={() => {
              setShowSearchHE(false);
            }}
            ref={inputRef}
          />

          <SVGIcon
            icon={SVGIcons.WALLET_SEARCH}
            className={`token-search ${!showSearchHE ? '' : 'hide'}`}
            onClick={() => {
              setShowSearchHE(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 200);
            }}
          />

          <SVGIcon
            icon={SVGIcons.WALLET_SETTINGS}
            onClick={() => {
              navigateTo(Screen.TOKENS_FILTER);
            }}
          />
        </div> */}
        {/* {allTokens?.length > 0 &&
          filteredTokenList &&
          filteredTokenList.length > 0 && (
            <>
              <FlatList
                list={filteredTokenList}
                renderItem={(token: TokenBalance) => (
                  <WalletInfoSectionItemComponent
                    key={`token-${token.symbol}`}
                    tokenSymbol={token.symbol}
                    tokenBalance={token}
                    tokenInfo={allTokens.find((t) => t.symbol === token.symbol)}
                    tokenMarket={market}
                    icon={SVGIcons.STEEM_ENGINE}
                    addBackground
                    mainValue={token.balance}
                    mainValueLabel={token.symbol}
                  />
                )}
                renderOnScroll
                searchBy="symbol"
                searchTerm={tokenFilter}
                searchCaseInsensitive
              />
            </>
          )} */}
        {/* {filteredTokenList && filteredTokenList.length === 0 && (
          <div className="no-token">
            <SVGIcon icon={SVGIcons.MESSAGE_ERROR} />
            <span className="text">
              {getMessage('html_tokens_none_available')}
            </span>
          </div>
        )} */}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
    currencyLabels: CurrencyUtils.getCurrencyLabels(
      state.steem.activeRpc?.testnet!,
    ),
    globalProperties: state.steem.globalProperties,
    delegations: state.steem.delegations,
    conversions: state.steem.conversions,
    // userTokens: state.hive.userTokens,
    // market: state.hive.tokenMarket,
    // allTokens: state.hive.tokens,
  };
};

const connector = connect(mapStateToProps, {
  fetchConversionRequests,
  loadTokensMarket,
  loadUserTokens,
  loadTokens,
  navigateTo,
  // loadPendingUnstaking,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const WalletInfoSectionComponent = connector(WalletInfoSection);
