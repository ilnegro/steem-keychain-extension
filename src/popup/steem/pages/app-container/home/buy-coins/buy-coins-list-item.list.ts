import { BuyCoinType } from '@popup/steem/pages/app-container/home/buy-coins/buy-coin-type.enum';
import { SVGIcons } from 'src/common-ui/icons.enum';

interface Exchange {
  name: string;
  image: SVGIcons;
  link: string;
  username: string;
  acceptedCoins: string[];
  link_sbd?: string;
}

export const exchanges: Exchange[] = [
  {
    name: 'Binance',
    image: SVGIcons.BUY_BINANCE,
    link: 'https://www.binance.com/en/trade/STEEM_USDT',
    username: 'bdhivesteem',
    acceptedCoins: ['STEEM'],
  },
  {
    name: 'Upbit',
    image: SVGIcons.BUY_UPBIT,
    link: 'https://id.upbit.com/exchange?code=CRIX.UPBIT.BTC-STEEM',
    username: 'user.dunamu',
    acceptedCoins: ['STEEM'],
  },
  {
    name: 'Gateio',
    image: SVGIcons.BUY_GATEIO,
    link: 'https://www.gate.io/trade/STEEM_USDT',
    username: 'gateiodeposit',
    acceptedCoins: ['STEEM'],
  },
  // { image: 'bkex.png', link: 'https://www.bkex.com/trade/STEEM_USDT' },
  // {
  //   image: 'bithumb.png',
  //   link: 'https://en.bithumb.com/trade/order/STEEM_KRW',
  // },
  // {
  //   name: 'Ionomy',
  //   image: SVGIcons.BUY_IONOMY,
  //   link: 'https://exchange.ionomy.com/en/markets/btc-steem',
  //   username: 'ionomy',
  //   acceptedCoins: ['STEEM', 'SBD'],
  // },
  {
    name: 'HTX',
    image: SVGIcons.BUY_HTX,
    link: 'https://www.htx.com/trade/steem_usdt',
    link_sbd: 'https://www.htx.com/trade/sbd_usdt',
    username: 'htx-9tuqx5jg',
    acceptedCoins: ['STEEM', 'SBD'],
  },
  {
    name: 'Mexc',
    image: SVGIcons.BUY_MEXC,
    link: 'https://www.mexc.com/exchange/STEEM_USDT',
    username: 'mxcsteem',
    acceptedCoins: ['STEEM'],
  },

  // {
  //   name: 'Probit',
  //   image: NewIcons.PROBIT,
  //   link: 'https://www.probit.com/app/exchange/STEEM-USDT',
  //   username: 'probitsteem',
  //   acceptedCoins: ['STEEM'],
  // },
  // {
  //   image: 'bittrex.png',
  //   link: 'https://global.bittrex.com/Market/Index?MarketName=BTC-STEEM',
  //   username: 'bittrex',
  //   acceptedCoins: ["STEEM", "SBD"]
  // },
];

interface Platform {
  name: string;
  image: SVGIcons;
  link: string;
  description: string;
}

interface BuyCoinsListItemInterface {
  list: Platform[];
  exchanges: Exchange[];
}

export const BuyCoinsListItem = (
  type: BuyCoinType,
  username: string,
): BuyCoinsListItemInterface => {
  switch (type) {
    case BuyCoinType.BUY_STEEM:
      return {
        list: [
          // {
          //   name: 'Transak',
          //   image: SVGIcons.BUY_TRANSAK,
          //   link: `https://global.transak.com?apiKey=${Config.transak.apiKey}&defaultCryptoCurrency=STEEM&exchangeScreenTitle=Buy%20STEEMs&isFeeCalculationHidden=true&walletAddress=${username}`,
          //   description: 'html_popup_transak_description',
          // },
          // {
          //   name: 'Blocktrades',
          //   image: 'blocktrades.svg',
          //   link: `https://blocktrades.us/en/trade?affiliate_id=dfccdbcb-6093-4e4a-992d-689bf46e2523&input_coin_type=btc&output_coin_type=steem&output_coin_amount=10&receive_address=${username}`,
          //   description: 'html_popup_blocktrades_description',
          // },
        ],
        exchanges: exchanges.filter((exchange) =>
          exchange.acceptedCoins?.includes('STEEM'),
        ),
      };
    case BuyCoinType.BUY_SBD:
      return {
        list: [
          // {
          //   name: 'Blocktrades',
          //   image: 'blocktrades.svg',
          //   link: `https://blocktrades.us/en/trade?affiliate_id=dfccdbcb-6093-4e4a-992d-689bf46e2523&input_coin_type=btc&output_coin_type=sbd&output_coin_amount=10&receive_address=${username}`,
          //   description: 'html_popup_blocktrades_description',
          // },
        ],
        exchanges: exchanges.filter((exchange) =>
          exchange.acceptedCoins?.includes('SBD'),
        ),
      };
  }
};
