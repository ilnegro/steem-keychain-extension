import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Rpc } from '@interfaces/rpc.interface';
import { RootState } from '@popup/multichain/store';
import { setActiveRpc } from '@popup/steem/actions/active-rpc.actions';
import {
  setDisplayChangeRpcPopup,
  setSwitchToRpc,
} from '@popup/steem/actions/rpc-switcher';
import RpcUtils from '@popup/steem/utils/rpc.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import LocalStorageUtils from 'src/utils/localStorage.utils';
import { store } from '@popup/multichain/store';

// Definisci il tipo di dispatch che supporta i thunk
type AppDispatch = ThunkDispatch<RootState, unknown, any>;

export const useWorkingRPC = async (activeRpc?: Rpc) => {
  const dispatch: AppDispatch = store.dispatch; // Usa il tipo corretto
  const switchAuto = await LocalStorageUtils.getValueFromLocalStorage(
    LocalStorageKeyEnum.SWITCH_RPC_AUTO,
  );
  const currentRpc = activeRpc || store.getState().steem.activeRpc;
  for (const rpc of RpcUtils.getFullList().filter(
    (rpc) => rpc.uri !== currentRpc?.uri && !rpc.testnet,
  )) {
    if (await RpcUtils.checkRpcStatus(rpc.uri)) {
      if (switchAuto) {
        await dispatch(setActiveRpc(rpc)); // Usa await per il thunk
      } else {
        dispatch(setSwitchToRpc(rpc));
        dispatch(setDisplayChangeRpcPopup(true));
      }
      return;
    }
  }
};
