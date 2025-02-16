import { ActionPayload, AppThunk } from '@popup/multichain/actions/interfaces';
import { setErrorMessage } from '@popup/multichain/actions/message.actions';
import { SteemActionType } from '@popup/steem/actions/action-type.enum';
import { DelegationUtils } from '@popup/steem/utils/delegation.utils';
import { DelegationsPayload } from 'src/interfaces/delegations.interface';
import Logger from 'src/utils/logger.utils';

export const loadDelegators =
  (username: string): AppThunk =>
  async (dispatch) => {
    try {
      const delegators = await DelegationUtils.getDelegators(username);
      if (!delegators) {
        dispatch(
          setErrorMessage('popup_html_error_retrieving_incoming_delegations'),
        );
      }
      const action: ActionPayload<DelegationsPayload> = {
        type: SteemActionType.FETCH_DELEGATORS,
        payload: { incoming: delegators },
      };
      dispatch(action);
    } catch (e) {
      const action: ActionPayload<DelegationsPayload> = {
        type: SteemActionType.FETCH_DELEGATORS,
        payload: { incoming: null },
      };
      dispatch(action);
      dispatch(
        setErrorMessage('popup_html_error_retrieving_incoming_delegations'),
      );
      Logger.error(e);
    }
  };

export const loadDelegatees =
  (username: string): AppThunk =>
  async (dispatch) => {
    try {
      const action: ActionPayload<DelegationsPayload> = {
        type: SteemActionType.FETCH_DELEGATEES,
        payload: { outgoing: await DelegationUtils.getDelegatees(username) },
      };
      dispatch(action);
    } catch (e) {
      Logger.error(e);
    }
  };

export const loadPendingOutgoingUndelegations =
  (username: string): AppThunk =>
  async (dispatch) => {
    try {
      const action: ActionPayload<DelegationsPayload> = {
        type: SteemActionType.FETCH_PENDING_OUTGOING_UNDELEGATION,
        payload: {
          pendingOutgoingUndelegation:
            await DelegationUtils.getPendingOutgoingUndelegation(username),
        },
      };
      dispatch(action);
    } catch (error) {
      Logger.error(error);
    }
  };
