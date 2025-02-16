import { Chain, useChainContext } from '@popup/multichain/multichain.context';
import React from 'react';

export const EvmAppComponent = () => {
  const { setChain } = useChainContext();
  return (
    <div>
      <button onClick={() => setChain(Chain.STEEM)}>switch to steem</button>
    </div>
  );
};
