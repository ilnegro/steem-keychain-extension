import { Chain, useChainContext } from '@popup/multichain/multichain.context';
import React from 'react';

const ChainSelector = () => {
  const { setChain } = useChainContext();
  return (
    <div className="chain-selector-page">
      Chain selectors
      <div
        className="chain-card"
        onClick={() => {
          setChain(Chain.STEEM);
        }}>
        STEEM
      </div>
      <div
        className="chain-card"
        onClick={() => {
          setChain(Chain.EVM);
        }}>
        EVM
      </div>
    </div>
  );
};

export default ChainSelector;
