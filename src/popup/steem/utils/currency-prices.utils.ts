import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import Logger from 'src/utils/logger.utils';

const getPrices = async () => {
  let prices;
  try {
    const response = await (
      await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,steem,steem-dollars&vs_currencies=usd&include_24hr_change=true`,
      )
    ).json();

    // {"bitcoin":{"usd":95055},"steem":{"usd":0.169783},"steem-dollars":{"usd":0.429379}}
    if (response) {
      prices = {
        ...response,
        steem_dollars: {
          usd: response['steem-dollars'].usd,
          usd_24h_change: response['steem-dollars'].usd_24h_change,
        },
      };

      prices;
      LocalStorageUtils.saveValueInLocalStorage(
        LocalStorageKeyEnum.LAST_PRICE,
        prices,
      );
    } else {
      Logger.error('Cannot fetch prices from API. Using last known price...');
      prices = await LocalStorageUtils.getValueFromLocalStorage(
        LocalStorageKeyEnum.LAST_PRICE,
      );
    }
  } catch (err) {
    Logger.error(
      'Cannot fetch prices from API. Using last known price...',
      err,
    );
    prices = await LocalStorageUtils.getValueFromLocalStorage(
      LocalStorageKeyEnum.LAST_PRICE,
    );
  } finally {
    return prices ?? {};
  }
};

const getBittrexCurrency = async (currency: string) => {
  const response = await fetch(
    'https://api.bittrex.com/api/v1.1/public/getcurrencies',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (response.status === 200) {
    return (await response.json()).find((c: any) => c.Currency == currency);
  }
  return null;
};

const CurrencyPricesUtils = {
  getBittrexCurrency,
  getPrices,
};

export default CurrencyPricesUtils;
