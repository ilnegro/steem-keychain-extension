import { Rpc } from '@interfaces/rpc.interface';
import { setMk } from '@popup/multichain/actions/mk.actions';
import { navigateTo } from '@popup/multichain/actions/navigation.actions';
import { SignInRouterComponent } from '@popup/multichain/pages/sign-in/sign-in-router.component';
import { RootState } from '@popup/multichain/store';
import {
  retrieveAccounts,
  setAccounts,
} from '@popup/steem/actions/account.actions';
import {
  loadActiveAccount,
  refreshActiveAccount,
} from '@popup/steem/actions/active-account.actions';
import { setActiveRpc } from '@popup/steem/actions/active-rpc.actions';
import { loadCurrencyPrices } from '@popup/steem/actions/currency-prices.actions';
import { loadGlobalProperties } from '@popup/steem/actions/global-properties.actions';
import {
  setDisplayChangeRpcPopup,
  setSwitchToRpc,
} from '@popup/steem/actions/rpc-switcher';
import { initHiveEngineConfigFromStorage } from '@popup/steem/actions/steem-engine-config.actions';
import { AddAccountRouterComponent } from '@popup/steem/pages/add-account/add-account-router/add-account-router.component';
import { AppRouterComponent } from '@popup/steem/pages/app-container/app-router.component';
import AccountUtils from '@popup/steem/utils/account.utils';
import ActiveAccountUtils from '@popup/steem/utils/active-account.utils';
import RpcUtils from '@popup/steem/utils/rpc.utils';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import ButtonComponent from 'src/common-ui/button/button.component';
import { LoadingComponent } from 'src/common-ui/loading/loading.component';
import { SplashscreenComponent } from 'src/common-ui/splashscreen/splashscreen.component';
import Config from 'src/config';
import { LocalAccount } from 'src/interfaces/local-account.interface';
import { Screen } from 'src/reference-data/screen.enum';
import getMessage from 'src/background/utils/i18n.utils';
import { ColorsUtils } from 'src/utils/colors.utils';
import { useWorkingRPC } from 'src/utils/rpc-switcher.utils';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';

let rpc: string | undefined = '';

const HiveApp = ({
  mk,
  accounts,
  activeAccountUsername,
  activeRpc,
  loading,
  loadingState,
  isCurrentPageHomePage,
  displayProxySuggestion,
  navigationStack,
  appStatus,
  setMk,
  navigateTo,
  loadActiveAccount,
  switchToRpc,
  displayChangeRpcPopup,
  initHiveEngineConfigFromStorage,
  setAccounts,
  loadGlobalProperties,
  setActiveRpc,
  setDisplayChangeRpcPopup,
  loadCurrencyPrices,
  hasFinishedSignup,
}: PropsFromRedux) => {
  const [isAppReady, setAppReady] = useState(false);
  const [initialRpc, setInitialRpc] = useState<Rpc>();
  const [displaySplashscreen, setDisplaySplashscreen] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false); // Stato per sblocco

  useEffect(() => {
    // console.log('[HiveApp] Running initApplication');
    initApplication();
  }, []);

  useEffect(() => {
    if (activeRpc?.uri !== 'NULL' && activeRpc?.uri !== rpc && isUnlocked) {
      // console.log(`[HiveApp] Active RPC changed, re-running initApplication: ${activeRpc?.uri}`);
      initApplication();
    }
    rpc = activeRpc?.uri;
  }, [activeRpc, isUnlocked]);

  useEffect(() => {
    const found = navigationStack.find(
      (navigation) =>
        navigation.currentPage === Screen.ACCOUNT_PAGE_INIT_ACCOUNT ||
        navigation.currentPage === Screen.SIGN_IN_PAGE,
    );
    if (
      isAppReady &&
      isUnlocked &&
      (navigationStack.length === 0 || found) &&
      hasFinishedSignup
    ) {
      // console.log('[HiveApp] App ready, initializing active account');
      if (accounts.length > 0) {
        initActiveAccount(accounts);
      }
      if (!appStatus.processingDecryptAccount) {
        // console.log('[HiveApp] Selecting component');
        selectComponent(mk, accounts);
      }
    }
  }, [
    isAppReady,
    isUnlocked,
    mk,
    accounts,
    hasFinishedSignup,
    appStatus.processingDecryptAccount,
  ]);

  useEffect(() => {
    if (displaySplashscreen) {
      if (appStatus.priceLoaded && appStatus.globalPropertiesLoaded) {
        // console.log('[HiveApp] Hiding splashscreen');
        setTimeout(() => {
          setDisplaySplashscreen(false);
        }, Config.loader.minDuration);
      }
    }
  }, [appStatus, displaySplashscreen]);

  const initApplication = async () => {
    try {
//      // console.log('[HiveApp] Starting initApplication');
      // Pulizia temporanea per test
//      // console.log('[HiveApp] Clearing ACCOUNTS for test');
//      await LocalStorageUtils.removeFromLocalStorage(LocalStorageKeyEnum.ACCOUNTS);

      loadCurrencyPrices();
      // console.log('[HiveApp] Called loadCurrencyPrices');

      const storedAccounts = await AccountUtils.hasStoredAccounts();
      // console.log(`[HiveApp] Stored accounts exist: ${storedAccounts}`);

      let accountsFromStorage: LocalAccount[] = [];
      if (storedAccounts && mk && isUnlocked) {
        // console.log(`[HiveApp] Getting accounts with mk: ${mk}`);
        try {
          const fetchedAccounts = await AccountUtils.getAccountsFromLocalStorage(mk);
          accountsFromStorage = fetchedAccounts || [];
          // console.log(`[HiveApp] Accounts from storage: ${JSON.stringify(accountsFromStorage)}`);
        } catch (error) {
          console.error('[HiveApp] Failed to fetch accounts from storage:', error);
          await LocalStorageUtils.removeFromLocalStorage(LocalStorageKeyEnum.ACCOUNTS);
          // console.log('[HiveApp] Cleared corrupted ACCOUNTS from storage');
          accountsFromStorage = [];
        }
        setAccounts(accountsFromStorage);
      } else {
        // console.log('[HiveApp] No stored accounts, mk, or not unlocked, skipping account load');
        setAccounts([]);
      }

      setAppReady(true);
      // console.log('[HiveApp] Set app ready');
      await selectComponent(mk, accountsFromStorage);
      // console.log('[HiveApp] selectComponent done');

      const rpc = await RpcUtils.getCurrentRpc();
      // console.log(`[HiveApp] Current RPC: ${JSON.stringify(rpc)}`);
      setInitialRpc(rpc);
      await initActiveRpc(rpc);
      // console.log('[HiveApp] initActiveRpc done');

      loadGlobalProperties();
      // console.log('[HiveApp] Called loadGlobalProperties');
      initHiveEngineConfigFromStorage();
      // console.log('[HiveApp] Called initHiveEngineConfigFromStorage');

      if (accountsFromStorage.length > 0 && isUnlocked) {
        // console.log('[HiveApp] Initializing active account');
        initActiveAccount(accountsFromStorage);
      }
    } catch (error) {
      console.error('[HiveApp] Error in initApplication:', error);
      setAppReady(true);
      navigateTo(Screen.SIGN_IN_PAGE);
    }
  };

  const initActiveRpc = async (rpc: Rpc) => {
    try {
      // console.log(`[HiveApp] Initializing active RPC: ${rpc.uri}`);
      if (!rpc || rpc.uri === 'NULL' || rpc.uri === 'DEFAULT') {
        // console.log('[HiveApp] Invalid RPC, using default');
        rpc = { uri: 'https://api.steemit.com', testnet: false };
      }
      const rpcStatusOk = await RpcUtils.checkRpcStatus(rpc.uri);
      // console.log(`[HiveApp] RPC status: ${rpcStatusOk}`);
      setDisplayChangeRpcPopup(!rpcStatusOk);
      if (rpcStatusOk) {
        // console.log('[HiveApp] Setting active RPC:', rpc);
        await setActiveRpc(rpc);
      } else {
//        await useWorkingRPC(setActiveRpc, rpc, activeRpc);
        await useWorkingRPC(rpc);
      }
    } catch (error) {
      console.error('[HiveApp] Failed to initialize RPC:', error);
      setDisplayChangeRpcPopup(true);
    }
  };

  const initActiveAccount = async (accounts: LocalAccount[]) => {
    try {
      // console.log(`[HiveApp] Initializing active account with accounts: ${JSON.stringify(accounts)}`);
      const lastActiveAccountName =
        await ActiveAccountUtils.getActiveAccountNameFromLocalStorage();
      // console.log(`[HiveApp] Last active account name: ${lastActiveAccountName}`);
      const lastActiveAccount = accounts.find(
        (account: LocalAccount) => lastActiveAccountName === account.name,
      );
      // console.log(`[HiveApp] Last active account: ${JSON.stringify(lastActiveAccount)}`);
      loadActiveAccount(lastActiveAccount ? lastActiveAccount : accounts[0]);
      // console.log('[HiveApp] Called loadActiveAccount');
    } catch (error) {
      console.error('[HiveApp] Failed to initialize active account:', error);
    }
  };

  const selectComponent = async (mk: string, accounts: LocalAccount[]) => {
    try {
      // console.log(`[HiveApp] Selecting component with mk: ${mk}, accounts: ${JSON.stringify(accounts)}`);
      if (isUnlocked && accounts && accounts.length > 0) {
        setDisplaySplashscreen(true);
        navigateTo(Screen.HOME_PAGE, true);
        // console.log('[HiveApp] Navigating to HOME_PAGE');
      } else if (isUnlocked) {
        navigateTo(Screen.ACCOUNT_PAGE_INIT_ACCOUNT, true);
        // console.log('[HiveApp] Navigating to ACCOUNT_PAGE_INIT_ACCOUNT');
      } else if (
        mk &&
        mk.length === 0 &&
        accounts.length === 0 &&
        !hasFinishedSignup
      ) {
        navigateTo(Screen.SIGN_UP_PAGE, true);
        // console.log('[HiveApp] Navigating to SIGN_UP_PAGE');
      } else {
        navigateTo(Screen.SIGN_IN_PAGE);
        // console.log('[HiveApp] Navigating to SIGN_IN_PAGE');
      }
    } catch (error) {
      console.error('[HiveApp] Error in selectComponent:', error);
      navigateTo(Screen.SIGN_IN_PAGE);
    }
  };

const renderMainLayoutNav = () => {
  // console.log(`[HiveApp] Rendering main layout nav, mk: ${mk}, accounts: ${JSON.stringify(accounts)}`);
  if (!isAppReady || !isUnlocked) {
    // console.log('[HiveApp] Showing SignInRouterComponent');
    return <SignInRouterComponent setIsUnlocked={setIsUnlocked} />;
  } else {
    if (accounts && accounts.length === 0) {
      // console.log('[HiveApp] Showing AddAccountRouterComponent');
      return <AddAccountRouterComponent />;
    } else {
      // console.log('[HiveApp] Showing AppRouterComponent');
      return <AppRouterComponent />;
    }
  }
};

  const renderPopup = (
    loading: number,
    activeRpc: Rpc | undefined,
    displayProxySuggestion: boolean,
    displayChangeRpcPopup: boolean,
    switchToRpc: Rpc | undefined,
  ) => {
    // console.log(`[HiveApp] Rendering popup, loading: ${loading}, activeRpc: ${JSON.stringify(activeRpc)}`);
    if (loading || !activeRpc || activeRpc.uri === 'NULL' || activeRpc.uri === 'DEFAULT') {
      // console.log('[HiveApp] Showing loading due to invalid RPC');
      return (
        <LoadingComponent
          operations={loadingState.loadingOperations}
          caption={loadingState.caption}
          loadingPercentage={loadingState.loadingPercentage}
        />
      );
    } else if (displayChangeRpcPopup && activeRpc && switchToRpc) {
      // console.log('[HiveApp] Showing RPC change popup');
      return (
        <div className="change-rpc-popup">
          <div className="message">
            {getMessage('popup_html_rpc_not_responding_error', [
              initialRpc?.uri || 'unknown',
              switchToRpc?.uri || 'unknown',
            ])}
          </div>
          <ButtonComponent
            label="popup_html_switch_rpc"
            onClick={() => {
              setDisplayChangeRpcPopup(false);
              setTimeout(() => {
                setActiveRpc(switchToRpc!);
              }, 1000);
            }}
          />
        </div>
      );
    }
    // console.log('[HiveApp] No popup to render');
    return null;
  };

  return (
    <div className={`${isCurrentPageHomePage ? 'homepage' : 'app'}`}
         style={!isCurrentPageHomePage ? { height: '100%' } : undefined} >
      {displaySplashscreen && <SplashscreenComponent />}
      {renderPopup(
        loading,
        activeRpc,
        displayProxySuggestion,
        displayChangeRpcPopup,
        switchToRpc,
      )}
      {renderMainLayoutNav()}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    mk: state.mk,
    accounts: state.steem.accounts as LocalAccount[],
    activeRpc: state.steem.activeRpc,
    switchToRpc: state.steem.rpcSwitcher.rpc,
    displayChangeRpcPopup: state.steem.rpcSwitcher.display,
    loading: state.loading.loadingOperations.length,
    loadingState: state.loading,
    activeAccountUsername: state.steem.activeAccount.name,
    isCurrentPageHomePage:
      state.navigation.stack[0]?.currentPage === Screen.HOME_PAGE,
    displayProxySuggestion:
      state.steem.activeAccount &&
      state.steem.activeAccount.account &&
      state.steem.activeAccount.account.proxy === '' &&
      state.steem.activeAccount.account.witnesses_voted_for === 0,
    navigationStack: state.navigation.stack,
    appStatus: state.steem.appStatus,
    hasFinishedSignup: state.hasFinishedSignup,
  };
};

const connector = connect(mapStateToProps, {
  setMk,
  retrieveAccounts,
  navigateTo,
  refreshActiveAccount,
  setAccounts,
  loadActiveAccount,
  loadGlobalProperties,
  setSwitchToRpc,
  setActiveRpc,
  setDisplayChangeRpcPopup,
  initHiveEngineConfigFromStorage,
  loadCurrencyPrices,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export const HiveAppComponent = connector(HiveApp);