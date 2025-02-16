import { LocalAccount } from '@interfaces/local-account.interface';
import { setHasFinishedSignup } from '@popup/multichain/actions/has-finished-signup.actions';
import reducers from '@popup/multichain/reducers';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
// import {composeWithDevTools} from 'remote-redux-devtools';
import AccountUtils from '@popup/steem/utils/account.utils';
import ActiveAccountUtils from '@popup/steem/utils/active-account.utils';
import MkUtils from '@popup/steem/utils/mk.utils';
import RpcUtils from '@popup/steem/utils/rpc.utils';
import LocalStorageUtils from 'src/utils/localStorage.utils';

// const composeEnhancers = composeWithDevTools({
//   realtime: true,
//   port: 8000,
// });
/* istanbul ignore next */
const store = createStore(
  reducers,
  /* preloadedState, */ applyMiddleware(thunk),
);

if (store.getState().steem) {
  let previousAccounts = store.getState().steem.accounts as LocalAccount[];
  let previousRpc = store.getState().steem.activeRpc;
  let previousActiveAccountName = store.getState().steem.activeAccount?.name;
  let previousMk = store.getState().mk;
  let previousSteemEngineConfig = store.getState().steem.steemEngineConfig;

  /* istanbul ignore next */

  store.subscribe(() => {
    const {
      mk,
      steem: { accounts, activeRpc, activeAccount, steemEngineConfig },
      hasFinishedSignup,
    } = store.getState();
    if (!AccountUtils.isAccountListIdentical(previousAccounts, accounts)) {
      if (
        previousAccounts.length === 0 &&
        previousAccounts.length !== accounts.length &&
        !hasFinishedSignup
      ) {
        LocalStorageUtils.saveValueInLocalStorage(
          LocalStorageKeyEnum.HAS_FINISHED_SIGNUP,
          true,
        );
        store.dispatch(setHasFinishedSignup(true));
        // AnalyticsUtils.sendAddFirstAccountEvent();
      }
      previousAccounts = accounts;
      if (accounts.length !== 0) {
        AccountUtils.saveAccounts(accounts, mk);
      }
    }
    if (previousRpc && previousRpc.uri !== activeRpc?.uri && activeRpc) {
      previousRpc = activeRpc;
      RpcUtils.saveCurrentRpc(activeRpc);
    }
    if (activeAccount && previousActiveAccountName !== activeAccount.name) {
      previousActiveAccountName = activeAccount.name;
      ActiveAccountUtils.saveActiveAccountNameInLocalStorage(
        activeAccount.name as string,
      );
    }
    if (previousMk !== mk) {
      previousMk = mk;
      MkUtils.saveMkInLocalStorage(mk);
    }
    if (
      previousSteemEngineConfig &&
      steemEngineConfig &&
      (previousSteemEngineConfig.accountHistoryApi !==
        steemEngineConfig.accountHistoryApi ||
        previousSteemEngineConfig.rpc !== steemEngineConfig.rpc)
    ) {
      previousSteemEngineConfig = steemEngineConfig;
      LocalStorageUtils.saveValueInLocalStorage(
        LocalStorageKeyEnum.STEEM_ENGINE_ACTIVE_CONFIG,
        steemEngineConfig,
      );
    }
  });
}

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
