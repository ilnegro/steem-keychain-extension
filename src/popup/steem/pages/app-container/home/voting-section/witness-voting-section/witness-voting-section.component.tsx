import {
  KeychainKeyTypes,
  KeychainKeyTypesLC,
} from '@interfaces/keychain.interface';
import {
  TransactionOptions,
  TransactionOptionsMetadata,
} from '@interfaces/keys.interface';
import { Witness } from '@interfaces/witness.interface';
import {
  addCaptionToLoading,
  addToLoadingList,
  removeFromLoadingList,
} from '@popup/multichain/actions/loading.actions';
import {
  setErrorMessage,
  setSuccessMessage,
} from '@popup/multichain/actions/message.actions';
import { closeModal, openModal } from '@popup/multichain/actions/modal.actions';
import { RootState } from '@popup/multichain/store';
import { refreshActiveAccount } from '@popup/steem/actions/active-account.actions';
import BlockchainTransactionUtils from '@popup/steem/utils/blockchain.utils';
import { MultisigUtils } from '@popup/steem/utils/multisig.utils';
import WitnessUtils from '@popup/steem/utils/witness.utils';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { OperationButtonComponent } from 'src/common-ui/button/operation-button.component';
import { MetadataPopup } from 'src/common-ui/metadata-popup/metadata-popup.component';

const toWitnessObject = (name: string): Witness => ({
  votes: 0,
  signing_key: '',
  url: '',
  id: 0,
  owner: name,
  created: '',
  virtual_last_update: '',
  virtual_position: '',
  virtual_scheduled_time: '',
  total_missed: 0,
  last_aslot: 0,
  last_confirmed_block_num: 0,
  pow_worker: 0,
  props: {
    account_creation_fee: '',
    maximum_block_size: 0,
    sbd_interest_rate: 0,
    account_subsidy_budget: 0,
    account_subsidy_decay: 0,
  },
  sbd_exchange_rate: {
    base: '',
    quote: '',
  },
  last_sbd_exchange_update: '',
  last_work: '',
  running_version: '',
  hardfork_version_vote: '',
  hardfork_time_vote: '',
  available_witness_account_subsidies: 0,
});

const WitnessVotingSection = ({
  activeAccount,
  setErrorMessage,
  setSuccessMessage,
  refreshActiveAccount,
  addToLoadingList,
  removeFromLoadingList,
  addCaptionToLoading,
  openModal,
  closeModal,
}: PropsFromRedux) => {
  const processVoteForWitness = async (
    account: string,
    options?: TransactionOptions,
  ) => {
    try {
      addToLoadingList('html_popup_vote_witness_operation');
      const transactionConfirmed = await WitnessUtils.voteWitness(
        toWitnessObject(account),
        activeAccount.name!,
        activeAccount.keys.active!,
        options,
      );
      addToLoadingList('html_popup_confirm_transaction_operation');
      removeFromLoadingList('html_popup_vote_witness_operation');
      if (transactionConfirmed) {
        await BlockchainTransactionUtils.delayRefresh();
        removeFromLoadingList('html_popup_confirm_transaction_operation');
        refreshActiveAccount();
        if (transactionConfirmed.isUsingMultisig) {
          setSuccessMessage('multisig_transaction_sent_to_signers');
        } else setSuccessMessage(`html_popup_vote_${account}_witness_success`);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      removeFromLoadingList('html_popup_vote_witness_operation');
      removeFromLoadingList('html_popup_confirm_transaction_operation');
    }
  };

  const handleVoteForWitnessClicked = async (account: string) => {
    if (activeAccount.account.witnesses_voted_for === 30) {
      setErrorMessage('html_popup_vote_faisalamin_witness_error_30_votes');
    } else {
      const twoFaAccounts = await MultisigUtils.get2FAAccounts(
        activeAccount.account,
        KeychainKeyTypes.active,
      );

      let initialMetadata = {} as TransactionOptionsMetadata;
      for (const account of twoFaAccounts) {
        if (!initialMetadata.twoFACodes) initialMetadata.twoFACodes = {};
        initialMetadata.twoFACodes[account] = '';
      }

      if (twoFaAccounts.length > 0) {
        openModal({
          title: 'popup_html_transaction_metadata',
          children: (
            <MetadataPopup
              initialMetadata={initialMetadata}
              onSubmit={(metadata: TransactionOptionsMetadata) => {
                addCaptionToLoading('multisig_transmitting_to_2fa');
                processVoteForWitness(account, { metaData: metadata });
                closeModal();
              }}
              onCancel={() => closeModal()}
            />
          ),
        });
      } else {
        processVoteForWitness(account);
      }
    }
  };

  let voteForAccount: string | undefined = undefined;
  if (activeAccount.account.proxy.length === 0) {
    for (const acc of [
      'faisalamin',
      // 'cedricguillas'
    ]) {
      if (!activeAccount.account.witness_votes.includes(acc)) {
        voteForAccount = acc;
        break;
      }
    }
  }

  return (
    <div className="witness-voting-section">
      {voteForAccount && (
        <OperationButtonComponent
          dataTestId="vote-for-faisalamin"
          labelParams={[`@${voteForAccount}`]}
          onClick={() => {
            handleVoteForWitnessClicked(voteForAccount!);
          }}
          label={'html_popup_vote_for_witness'}
          requiredKey={KeychainKeyTypesLC.active}
          height="small"
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
  };
};

const connector = connect(mapStateToProps, {
  setErrorMessage,
  refreshActiveAccount,
  setSuccessMessage,
  addToLoadingList,
  removeFromLoadingList,
  addCaptionToLoading,
  openModal,
  closeModal,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export const WitnessVotingSectionComponent = connector(WitnessVotingSection);
