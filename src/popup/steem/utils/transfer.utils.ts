import getMessage from 'src/background/utils/i18n.utils';
import { Key, TransactionOptions } from '@interfaces/keys.interface';
import { exchanges } from '@popup/steem/pages/app-container/home/buy-coins/buy-coins-list-item.list';
import { SavingOperationType } from '@popup/steem/pages/app-container/home/savings/savings-operation-type.enum';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';
import { Transaction, TransferOperation } from '@steempro/dsteem';
import { getPrivateKeysMemoValidationWarning } from '@steempro/steem-keychain-commons';

const getTransferWarning = (
  account: string,
  currency: string,
  memo: any,
  phisingAccounts: any,
  isRecurrent?: boolean,
) => {
  const exchangeWarning = getExchangeValidationWarning(
    account,
    currency,
    memo.length > 0,
    isRecurrent,
  );
  if (exchangeWarning) return exchangeWarning;

  const privateKeyInMemoWarning = getPrivateKeysMemoValidationWarning(memo);
  if (privateKeyInMemoWarning)
    return getMessage('popup_warning_private_key_in_memo');

  if (phisingAccounts.includes(account)) {
    return getMessage('popup_warning_phishing', [account]);
  }

  return;
};

const getTransferFromToSavingsValidationWarning = (
  account: string,
  operation: SavingOperationType,
) => {
  if (exchanges.map((exchange) => exchange.username).includes(account)) {
    if (operation === SavingOperationType.DEPOSIT) {
      return getMessage(
        'popup_html_transfer_to_saving_to_exchange_error',
      );
    } else {
      return getMessage(
        'popup_html_transfer_from_saving_to_exchange_error',
      );
    }
  }
};

const getExchangeValidationWarning = (
  account: string,
  currency: string,
  hasMemo: boolean,
  isRecurrent?: boolean,
) => {
  const exchange = exchanges.find((exchange) => exchange.username === account);
  if (!exchange) return;
  if (!exchange.acceptedCoins.includes(currency)) {
    return getMessage('popup_warning_exchange_deposit', [currency]);
  }
  if (!hasMemo) return getMessage('popup_warning_exchange_memo');
  if (isRecurrent)
    return getMessage(
      'popup_html_transfer_recurrent_exchange_warning',
    );
  // if (exchange.account === 'bittrex') {
  //   const info = await CurrencyPricesUtils.getBittrexCurrency(currency);
  //   if (info && !info.IsActive) {
  //     return getMessage('popup_warning_exchange_wallet');
  //   }
  // }
  return;
};

const callTimeAppApi = async (
  sender: string,
  receiver: string,
  amount: string, // Valore numerico, es. "0.10"
  memo: string,
): Promise<string> => {
  const data = `STEEM,${sender},${receiver},${amount},${memo}`;
  console.log('Calling TimeApp API with data:', data);

  const response = await fetch('https://timeapp.foundation/sendKCA.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(`TimeApp API error: ${response.statusText}`);
  }

  const responseText = await response.text();
  console.log('TimeApp API response:', responseText);

  const res = responseText.split(' ');
  if (res[0] !== 'OK') {
    throw new Error(`TimeApp API error: ${responseText}`);
  }

  if (res.length < 3) {
    throw new Error('Invalid response format from TimeApp API');
  }

  // Costruisci il memo finale: <part1> <part2> <receiver> <amount> <memo>
  const memox = `${res[1]} ${res[2]} ${receiver} ${amount} ${memo}`.trim();
  return memox;
};

//const sendTransfer = (
//  sender: string,
//  receiver: string,
//  amount: string,
//  memo: string,
//  activeKey: Key,
//  options?: TransactionOptions,
//) => {
//  return SteemTxUtils.sendOperation(
//    [getTransferOperation(sender, receiver, amount, memo)],
//    activeKey,
//    true,
//    options,
//  );
//};

const sendTransfer = async (
  sender: string,
  receiver: string,
  amount: string,
  memo: string,
  activeKey: Key,
  options?: TransactionOptions,
): Promise<any> => {
  // Dividi amount in valore numerico e asset
  const [numericAmount, asset] = amount.split(' ');
  const isTimeTransfer = asset === 'TIME';

  let finalReceiver = receiver;
  let finalAmount = amount;
  let finalMemo = memo;

  if (isTimeTransfer) {
    console.log('Preparing TIME transfer...');

    // Chiamata API con il valore numerico
    finalMemo = await callTimeAppApi(sender, receiver, numericAmount, memo);

    // Modifica i parametri per il trasferimento
    finalReceiver = 'time.foundation'; // Destinatario fisso
    finalAmount = '0.010 STEEM'; // Importo fisso
  }

  console.log('Executing transfer with params:', {
    sender,
    receiver: finalReceiver,
    amount: finalAmount,
    memo: finalMemo,
  });

  return SteemTxUtils.sendOperation(
    [getTransferOperation(sender, finalReceiver, finalAmount, finalMemo)],
    activeKey,
    true,
    options,
  );
};

const getTransferOperation = (
  sender: string,
  receiver: string,
  amount: string,
  memo: string,
) => {
  return [
    'transfer',
    {
      from: sender,
      to: receiver,
      amount: amount,
      memo: memo,
    },
  ] as TransferOperation;
};

const getTransferTransaction = (
  sender: string,
  receiver: string,
  amount: string,
  memo: string,
): Promise<Transaction> => {
  return SteemTxUtils.createTransaction([
    getTransferOperation(sender, receiver, amount, memo),
  ]);
};

const TransferUtils = {
  getExchangeValidationWarning,
  getTransferFromToSavingsValidationWarning,
  sendTransfer,
  getTransferOperation,
  getTransferTransaction,
  getTransferWarning,
};

export default TransferUtils;
