import { Token, TokenBalance } from '@interfaces/tokens.interface';
import { ConversionType } from '@popup/steem/pages/app-container/home/conversion/conversion-type.enum';
import { PowerType } from '@popup/steem/pages/app-container/home/power-up-down/power-type.enum';
import { TokenOperationType } from '@popup/steem/pages/app-container/home/tokens/token-operation/token-operation.component';
import { Screen } from '@reference-data/screen.enum';
import { SVGIcons } from 'src/common-ui/icons.enum';

export interface ActionButton {
  label: string;
  labelParams?: string[];
  icon: SVGIcons;
  nextScreen: Screen;
  nextScreenParams?: any;
}

export const WalletInfoSectionActions = (
  tokenSymbol: string,
  tokenInfo?: Token,
  tokenBalance?: TokenBalance,
): ActionButton[] => {
  if (tokenSymbol === 'SBD') {
    return [
      {
        label: 'popup_html_send',
        icon: SVGIcons.WALLET_SEND,
        nextScreen: Screen.TRANSFER_FUND_PAGE,
        nextScreenParams: { selectedCurrency: 'sbd' },
      },
      {
        label: 'popup_html_convert',
        icon: SVGIcons.WALLET_CONVERT,
        nextScreen: Screen.CONVERSION_PAGE,
        nextScreenParams: {
          conversionType: ConversionType.CONVERT_SBD_TO_STEEM,
        },
      },
      {
        label: 'popup_html_savings',
        icon: SVGIcons.WALLET_SAVINGS,
        nextScreen: Screen.SAVINGS_PAGE,
        nextScreenParams: { selectedCurrency: 'sbd' },
      },
    ];
  } else if (tokenSymbol === 'STEEM') {
    return [
      {
        label: 'popup_html_send',
        icon: SVGIcons.WALLET_SEND,
        nextScreen: Screen.TRANSFER_FUND_PAGE,
        nextScreenParams: { selectedCurrency: 'steem' },
      },
      {
        label: 'popup_html_pu',
        icon: SVGIcons.WALLET_POWER_UP,
        nextScreen: Screen.POWER_UP_PAGE,
        nextScreenParams: { powerType: PowerType.POWER_UP },
      },

      {
        label: 'popup_html_savings',
        icon: SVGIcons.WALLET_SAVINGS,
        nextScreen: Screen.SAVINGS_PAGE,
        nextScreenParams: { selectedCurrency: 'steem' },
      },
    ];
  } else if (tokenSymbol === 'SP') {
    return [
      {
        label: 'popup_html_delegate_short',
        icon: SVGIcons.WALLET_SP_DELEGATIONS,
        nextScreen: Screen.DELEGATION_PAGE,
      },
      // {
      //   label: 'popup_html_delegate_rc_short',
      //   icon: SVGIcons.WALLET_RC_DELEGATIONS,
      //   nextScreen: Screen.RC_DELEGATIONS_PAGE,
      // },
      {
        label: 'dialog_title_powerdown',
        icon: SVGIcons.WALLET_POWER_DOWN,
        nextScreen: Screen.POWER_DOWN_PAGE,
        nextScreenParams: { powerType: PowerType.POWER_DOWN },
      },
    ];
  } else {
    const actions: ActionButton[] = [];
    actions.push({
      label: 'popup_html_send_transfer',
      nextScreen: Screen.TOKENS_TRANSFER,
      nextScreenParams: {
        tokenBalance,
        tokenInfo,
      },
      icon: SVGIcons.WALLET_SEND,
    });
    if (tokenInfo?.stakingEnabled) {
      actions.push({
        label: 'popup_html_token_stake',
        nextScreen: Screen.TOKENS_OPERATION,
        nextScreenParams: {
          tokenBalance,
          operationType: TokenOperationType.STAKE,
          tokenInfo: tokenInfo,
        },
        icon: SVGIcons.WALLET_TOKEN_STAKE,
      });
      actions.push({
        label: 'popup_html_token_unstake',
        nextScreen: Screen.TOKENS_OPERATION,
        nextScreenParams: {
          tokenBalance,
          operationType: TokenOperationType.UNSTAKE,
          tokenInfo: tokenInfo,
        },
        icon: SVGIcons.WALLET_TOKEN_UNSTAKE,
      });
    }
    if (tokenInfo?.delegationEnabled) {
      actions.push({
        label: 'popup_html_token_delegate',
        nextScreen: Screen.TOKENS_OPERATION,
        nextScreenParams: {
          tokenBalance,
          operationType: TokenOperationType.DELEGATE,
          tokenInfo: tokenInfo,
        },
        icon: SVGIcons.WALLET_TOKEN_DELEGATIONS,
      });
    }

    return actions;
  }
};
