<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

- [About Keychain][1]
- [Usage][2]
- [Operations][3]
  - [steem_keychain][4]
    - [requestHandshake][5]
      - [Parameters][6]
    - [requestEncodeMessage][7]
      - [Parameters][8]
      - [Examples][9]
    - [requestEncodeWithKeys][10]
      - [Parameters][11]
      - [Examples][12]
    - [requestVerifyKey][13]
      - [Parameters][14]
      - [Examples][15]
    - [requestSignBuffer][16]
      - [Parameters][17]
    - [requestAddAccountAuthority][18]
      - [Parameters][19]
      - [Examples][20]
    - [requestRemoveAccountAuthority][21]
      - [Parameters][22]
      - [Examples][23]
    - [requestAddKeyAuthority][24]
      - [Parameters][25]
      - [Examples][26]
    - [requestRemoveKeyAuthority][27]
      - [Parameters][28]
      - [Examples][29]
    - [requestBroadcast][30]
      - [Parameters][31]
      - [Examples][32]
    - [requestSignTx][33]
      - [Parameters][34]
      - [Examples][35]
    - [requestSignedCall][36]
      - [Parameters][37]
    - [requestPost][38]
      - [Parameters][39]
      - [Examples][40]
    - [requestVote][41]
      - [Parameters][42]
      - [Examples][43]
    - [requestCustomJson][44]
      - [Parameters][45]
      - [Examples][46]
    - [requestTransfer][47]
      - [Parameters][48]
      - [Examples][49]
    - [requestSendToken][50]
      - [Parameters][51]
      - [Examples][52]
    - [requestDelegation][53]
      - [Parameters][54]
      - [Examples][55]
    - [requestWitnessVote][56]
      - [Parameters][57]
      - [Examples][58]
    - [requestProxy][59]
      - [Parameters][60]
      - [Examples][61]
    - [requestPowerUp][62]
      - [Parameters][63]
      - [Examples][64]
    - [requestPowerDown][65]
      - [Parameters][66]
      - [Examples][67]
    - [requestCreateClaimedAccount][68]
      - [Parameters][69]
    - [requestCreateProposal][70]
      - [Parameters][71]
      - [Examples][72]
    - [requestRemoveProposal][73]
      - [Parameters][74]
      - [Examples][75]
    - [requestUpdateProposalVote][76]
      - [Parameters][77]
      - [Examples][78]
    - [requestAddAccount][79]
      - [Parameters][80]
      - [Examples][81]
    - [requestConversion][82]
      - [Parameters][83]
      - [Examples][84]
    - [requestRecurrentTransfer][85]
      - [Parameters][86]
      - [Examples][87]
    - [requestSwap][88]
      - [Parameters][89]
      - [Examples][90]
- [requestCallback][91]
  - [Parameters][92]

## About Keychain

![][93]

Putting private keys directly into websites is not safe or secure, even ones run by reputable community members. Yet this is currently how nearly every Steem-based site or service currently works. On top of that, most Steem users likely use their master password which is even worse.

The Vessel desktop wallet software is a secure alternative, but it is too difficult to use for the majority of Steem users and does not easily interact with websites - which is Steem's primary use case.

On Ethereum, you never have to enter your private key into a website to use a dApp. You can just use a browser extension like Metamask, which dApp websites can interface with to securely store your keys and broadcast transactions to the blockchain.

Steem Keychain aims to bring the security and ease-of-use of Metamask to the Steem blockchain platform.

### Installation

You can download and install the latest published version of the extension for the following browsers:

- Google Chrome (or Opera/Brave): [on Chrome Store][94]
  - Export your keys from Steem keychain (in settings)
  - Download this repository as zip
  - Unzip the downloaded folder
  - Right click on any existing extension > Manage my extensions.
  - Activate developer mode.
  - Click "Load Unpacked" and select the unzipped folder.
  - Import your keys (use the same master password)
- Firefox: [on Firefox Addon Store][95]

### Features

The Steem Keychain extension includes the following features:

- Store an unlimited number of Steem account keys, encrypted with AES
- View balances, transaction history, voting power, and resource credits
- Send STEEM and SBD transfers, manage witness votes, and update SP delegation right from the extension
- Manage your Steem Engine tokens
- Power up or down
- Securely interact with Steem-based websites that have integrated with Steem Keychain
- Manage transaction confirmation preferences by account and by website
- Locks automatically on browser shutdown or manually using the lock button

### Website Integration

Websites can currently request the Steem Keychain extension to perform the following functions / broadcast operations:

- Send a handshake to make sure the extension is installed
- Decrypt a message encrypted by a Steem account private key (commonly used for "logging in")
- Post a comment (top level or reply)
- Broadcast a vote
- Broadcast a custom JSON operation
- Send a transfer
- Send Steem Engine tokens
- Send Delegations
- Power up/down
- Vote for witnesses
- Create/Remove/Vote for proposals
- Create claimed accounts
- Sign Tx

## Usage

## Example

An example of a web page that interacts with the extension is included in the "example" folder in the repo. You can test it by running a local HTTP server and going to [http://localhost:1337/main.html][96] in your browser.

`cd example`
`python -m http.server 1337 //or any other method to run a static server`

NOTE: On localhost, it will run on port 1337.

## Using Keychain for logins

To login, you can encode a message from your backend and verify that the user can decode it using the `requestVerifyKey` method.
See an example in this project by @howo (@steempress witness):

[Frontend][97]

[Backend][98]

Alternatively, you can use `requestSignTx` and verify the signature on your backend.

## @hiveio/keychain

This [npm module][99] makes it easy to add Keychain support within the browser. It also includes helpful functions to check whether Keychain was used before. It was developed by @therealwolf (witness).

## Operations

The Steem Keychain extension will inject a "steem_keychain" JavaScript into all web pages opened in the browser while the extension is running. You can therefore check if the current user has the extension installed using the following code:

### steem_keychain

Use the `steem_keychain` methods listed below to issue requests to the Steem blockchain.

#### requestHandshake

This function is called to verify Keychain installation on a user's device

##### Parameters

- `callback` **[function][100]** Confirms Keychain installation (has no parameters)

#### requestEncodeMessage

This function is called to verify that the user has a certain authority over an account, by requesting to decode a message

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `receiver` **[String][101]** Account that will decode the string
- `message` **[String][101]** Message to be encrypted
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request

##### Examples

```javascript
const keychain = window.steem_keychain;
const message = username + Date.now();
keychain.requestEncodeMessage(
  username,
  myUsername,
  message,
  'Memo',
  (response) => {
    if (response.success) {
      const encodedMessage = response.result;
      // Send message to a server where you can use your private key to decode it
    }
  },
);
```

#### requestEncodeWithKeys

This function is called to allow encoding a message with multiple receivers. This is used in the case of multisig

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `publicKeys` **[Array][103]<[String][101]>** Key that can decode the string
- `message` **[String][101]** Message to be encrypted
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request

##### Examples

```javascript
const keychain = window.steem_keychain;
const message = username + Date.now();
keychain.requestEncodeMessage(
  username,
  [pubKey1, pubKey2],
  message,
  'Memo',
  (response) => {
    if (response.success) {
      const encodedMessages = response.result;
      // Send message to a server where you can use your private key to decode it
    }
  },
);
```

#### requestVerifyKey

This function is called to verify that the user has a certain authority over an account, by requesting to decode a message

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `message` **[String][101]** Message to be decoded by the account
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request

##### Examples

```javascript
const keychain = window.steem_keychain;
keychain.requestVerifyKey('ilnegro', encodedMessage, 'Posting', (response) => {
  if (response.success === true) {
    const decodedMessage = response.result;
  }
});
```

#### requestSignBuffer

Requests a message to be signed with proper authority

##### Parameters

- `account` **[String][101]** Steem account to perform the request. If null, user can choose the account from a dropdown (optional, default `null`)
- `message` **[String][101]** Message to be signed by the account
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)
- `title` **[String][101]** Override "Sign message" title (optional, default `null`)

#### requestAddAccountAuthority

Requests to add account authority over another account. For more information about multisig, please read [https://steempro.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain][104]

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `authorizedUsername` **[String][101]** Authorized account
- `role` **[String][101]** Type of authority. Can be 'Posting','Active' or 'Memo'
- `weight` **[number][105]** Weight of the authority
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Gives @ilnegro active authority with weight 2 to `account`
const keychain = window.steem_keychain;
keychain.requestAddAccountAuthority(
  account,
  'ilnegro',
  'Active',
  2,
  (response) => {
    console.log(response);
  },
);
```

#### requestRemoveAccountAuthority

Requests to remove an account authority over another account. For more information about multisig, please read [https://steempro.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain][104]

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `authorizedUsername` **[String][101]** Account to lose authority
- `role` **[String][101]** Type of authority. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Removes @ilnegro's active authority from `account`
const keychain = window.steem_keychain;
keychain.requestRemoveAccountAuthority(
  account,
  'ilnegro',
  'Active',
  (response) => {
    console.log(response);
  },
);
```

#### requestAddKeyAuthority

Requests to add a new key authority to an account. For more information about multisig, please read [https://steempro.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain][104]

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `authorizedKey` **[String][101]** New public key to be associated with the account
- `role` **[String][101]** Type of authority. Can be 'Posting','Active' or 'Memo'
- `weight` **[number][105]** Weight of the key authority
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
const keychain = window.steem_keychain;
keychain.requestAddKeyAuthority(username, publicKey, 'Memo', 1, (response) => {
  console.log(response);
});
```

#### requestRemoveKeyAuthority

Requests to remove a key to an account. For more information about multisig, please read [https://steempro.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain][104]

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `authorizedKey` **[String][101]** Key to be removed (public key).
- `role` **[String][101]** Type of authority. Can be 'Posting','Active' or 'Memo'.
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
const keychain = window.steem_keychain;
keychain.requestRemoveKeyAuthority(username, publicKey, 'Memo', (response) => {
  console.log(response);
});
```

#### requestBroadcast

Generic broadcast request

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `operations` **[Array][103]** Array of operations to be broadcasted
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
const keychain = window.steem_keychain;
keychain.requestBroadcast(
  'npfedwards',
  [
    [
      'account_witness_vote',
      {
        account: 'npfedwards',
        witness: 'ilnegro',
        approve: true,
      },
    ],
  ],
  'Active',
  (response) => {
    console.log(response);
  },
);
```

#### requestSignTx

Requests to sign a transaction with a given authority

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `tx` **[Object][106]** Unsigned transaction
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// This example would be done much easier with requestBroadcast
import dsteem from '@steempro/dsteem';

const client = new dsteem.Client(['https://api.steemit.com', 'https://api.justyy.co', 'https://api.steemitdev.com']);
const keychain = window.steem_keychain;

const props = await client.database.getDynamicGlobalProperties();
const headBlockNumber = props.head_block_number;
const headBlockId = props.head_block_id;
const expireTime = 600000;

const op = {
  ref_block_num: headBlockNumber & 0xffff,
  ref_block_prefix: Buffer.from(headBlockId, 'hex').readUInt32LE(4),
  expiration: new Date(Date.now() + expireTime).toISOString(),
  operations: [...] // Add operations here
};
keychain.requestSignTx(username, op, 'Posting', async (response) => {
  if (!response.error) {
    console.log(response.result);
    await client.database.verifyAuthority(response.result);
    await client.broadcast.send(response.result);
  }
});
```

#### requestSignedCall

Requests a signed call

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `method` **[String][101]** Method of the call
- `params` **[String][101]** Parameters of the call
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

**Meta**

- **deprecated**: This is deprecated.

#### requestPost

Requests to broadcast a blog post/comment

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `title` **[String][101]** Title of the blog post
- `body` **[String][101]** Content of the blog post
- `parent_perm` **[String][101]** Permlink of the parent post. Main tag for a root post
- `parent_account` **[String][101]** Author of the parent post. Pass null for root post
- `json_metadata` **[Object][106]** Parameters of the call
- `permlink` **[String][101]** Permlink of the blog post
- `comment_options` **[Object][106]** Options attached to the blog post. Consult Steem documentation at [https://developers.steem.io/apidefinitions/#broadcast_ops_comment_options][107] to learn more about it
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
const keychain = window.steem_keychain;
keychain.requestPost(
  'ilnegro',
  'Hello World!',
  '## This is a blog post \
\
And this is some text',
  'Blog',
  null,
  { format: 'markdown', description: 'A blog post', tags: ['Blog'] },
  'hello-world',
  {
    author: 'ilnegro',
    permlink: 'hi',
    max_accepted_payout: '100000.000 SBD',
    percent_steem_dollars: 10000,
    allow_votes: true,
    allow_curation_rewards: true,
    extensions: [
      [
        0,
        {
          beneficiaries: [
            { account: 'yabapmatt', weight: 1000 },
            { account: 'steemplus-pay', weight: 500 },
          ],
        },
      ],
    ],
  },
  (response) => {
    console.log(response);
  },
);
```

#### requestVote

Requests a vote

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `permlink` **[String][101]** Permlink of the blog post
- `author` **[String][101]** Author of the blog post
- `weight` **[Number][105]** Weight of the vote, comprised between -10,000 (-100%) and 10,000 (100%)
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Upvote with 50% weight
const keychain = window.steem_keychain;
keychain.requestVote(
  'npfedwards',
  'hello-world',
  'ilnegro',
  5000,
  (response) => {
    console.log(response);
  },
);
```

#### requestCustomJson

Requests a custom JSON broadcast

##### Parameters

- `account` **[String][101]** Steem account to perform the request. If null, user can choose the account from a dropdown (optional, default `null`)
- `id` **[String][101]** Type of custom_json to be broadcasted
- `key` **[String][101]** Type of key. Can be 'Posting','Active' or 'Memo'
- `json` **[String][101]** Stringified custom json
- `display_msg` **[String][101]** Message to display to explain to the user what this broadcast is about
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
const keychain = window.steem_keychain;
keychain.requestCustomJson(
  null,
  'sm_market_rent',
  'Active',
  JSON.stringify({
    items: ['9292cd44ccaef8b73a607949cc787f1679ede10b-93'],
    currency: 'DEC',
    days: 1,
  }),
  'Rent 1 card on Splinterlands',
  (response) => {
    console.log(response);
  },
);
```

#### requestTransfer

Requests a transfer

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `to` **[String][101]** Steem account to receive the transfer
- `amount` **[String][101]** Amount to be transfered. Requires 3 decimals.
- `memo` **[String][101]** The memo will be automatically encrypted if starting by '#' and the memo key is available on Keychain. It will also overrule the account to be enforced, regardless of the 'enforce' parameter
- `currency` **[String][101]** 'STEEM' or 'SBD'
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `enforce` **[boolean][108]** If set to true, user cannot chose to make the transfer from another account (optional, default `false`)
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
const keychain = window.steem_keychain;
keychain.requestTransfer(
  username,
  toUsername,
  amount.toFixed(3),
  '',
  'STEEM',
  (response) => {
    console.log(response);
  },
  true,
);
```

#### requestSendToken

Requests a token transfer

##### Parameters

- `account` **[String][101]** Steem account to perform the request
- `to` **[String][101]** Steem account to receive the transfer
- `amount` **[String][101]** Amount to be transferred. Requires 3 decimals.
- `memo` **[String][101]** Memo attached to the transfer
- `currency` **[String][101]** Token to be sent
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestSendToken(
    username,
    toUsername,
    amount.toFixed(3),
    memo,
    'DEC',
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestDelegation

Requests a delegation broadcast

##### Parameters

- `username` **[String][101]** Steem account to perform the request. If null, user can choose the account from a dropdown (optional, default `null`)
- `delegatee` **[String][101]** Account to receive the delegation
- `amount` **[String][101]** Amount to be transfered. Requires 3 decimals for SP, 6 for VESTS.
- `unit` **[String][101]** SP or VESTS
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestDelegation(null, 'ilnegro', '1.000', 'SP', (response) => {
    console.log(response);
  });
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestWitnessVote

Requests a witness vote broadcast

##### Parameters

- `username` **[String][101]** Steem account to perform the request. If null, user can choose the account from a dropdown (optional, default `null`)
- `witness` **[String][101]** Account to receive the witness vote
- `vote` **[boolean][108]** Set to true to vote for the witness, false to unvote
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Unvote our witness vote for @ilnegro
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestWitnessVote(null, 'ilnegro', false, (response) => {
    console.log(response);
  });
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestProxy

Select an account as proxy

##### Parameters

- `username` **[String][101]** Steem account to perform the request. If null, user can choose the account from a dropdown (optional, default `null`)
- `proxy` **[String][101]** Account to become the proxy. Empty string ('') to remove a proxy
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Let @ilnegro use our voting power in governance votes
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestProxy(null, 'ilnegro', (response) => {
    console.log(response);
  });
} else {
  alert('You do not have steem keychain installed');
}
```

```javascript
// Remove voting proxy
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestProxy(null, '', (response) => {
    console.log(response);
  });
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestPowerUp

Request a power up

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `recipient` **[String][101]** Account to receive the power up
- `steem` **[String][101]** Amount of STEEM to be powered up
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Power up 5 SP
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestPowerUp(username, username, '5.000', (response) => {
    console.log(response);
  });
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestPowerDown

Request a power down

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `steem_power` **[String][101]** Amount of STEEM to be powered down
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Power down 5 SP
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestPowerDown(username, '5.000', (response) => {
    console.log(response);
  });
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestCreateClaimedAccount

Request the creation of an account using claimed tokens

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `new_account` **[String][101]** New account to be created
- `owner` **[object][106]** owner authority object
- `active` **[object][106]** active authority object
- `posting` **[object][106]** posting authority object
- `memo` **[String][101]** public memo key
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

#### requestCreateProposal

Request the creation of a DHF proposal

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `receiver` **[String][101]** Account receiving the funding if the proposal is voted
- `subject` **[String][101]** Title of the DAO
- `permlink` **[String][101]** Permlink to the proposal description
- `daily_pay` **[String][101]** Daily amount to be received by `receiver`
- `start` **[String][101]** Starting date
- `end` **[String][101]** Ending date
- `extensions` **[String][101]** Stringified Array of extensions
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestCreateProposal(
    'keychain',
    'keychain',
    'Steem Keychain development',
    'steem-keychain-proposal-dhf-ran717',
    '10.000',
    '2022-03-22',
    '2023-03-21',
    JSON.stringify([]),
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestRemoveProposal

Request the removal of a DHF proposal

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `proposal_ids` **[String][101]** Stringified Array of ids of the proposals to be removed
- `extensions` **[String][101]** Stringified Array of extensions
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestRemoveProposal(
    username,
    JSON.stringify([216]),
    JSON.stringify([]),
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestUpdateProposalVote

Vote/Unvote a DHF proposal

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `proposal_ids` **[String][101]** Stringified Array of Ids of the proposals to be voted
- `approve` **[boolean][108]** Set to true to support the proposal, false to remove a vote
- `extensions` **[String][101]** Stringified Array of extensions
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Approve a proposal
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestUpdateProposalVote(
    username,
    JSON.stringify([216]),
    true,
    JSON.stringify([]),
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

```javascript
// Unapprove a proposal
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestUpdateProposalVote(
    username,
    JSON.stringify([216]),
    false,
    JSON.stringify([]),
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestAddAccount

Add a new account to Keychain

##### Parameters

- `username` **[String][101]** username of the account to be added
- `keys` **[Object][106]** private keys of the account : {active:'...',posting:'...',memo:'...'}. At least one must be specified. Alternatively, authorized accounts can be specified with @${username}.
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request

##### Examples

```javascript
if (window.steem_keychain) {
  const postingKey = '...';
  const keychain = window.steem_keychain;
  keychain.requestConversion(
    username,
    {
      posting: postingKey,
    },
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestConversion

Request currency conversion

##### Parameters

- `username` **[String][101]** Steem account to perform the request
- `amount` **[String][101]** amount to be converted.
- `collaterized` **[Boolean][108]** true to convert STEEM to SBD. false to convert SBD to STEEM.
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Convert 5 STEEM to SBD
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestConversion(username, '5.000', true, (response) => {
    console.log(response);
  });
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestRecurrentTransfer

Request recurrent transfer

##### Parameters

- `username` **[String][101]** Steem account to perform the request (optional, default `null`)
- `to` **[String][101]** Steem account receiving the transfers.
- `amount` **[String][101]** amount to be sent on each execution.
- `currency` **[String][101]** STEEM or SBD on mainnet.
- `memo` **[String][101]** transfer memo
- `recurrence` **[Number][105]** How often will the payment be triggered (in hours) - minimum 24.
- `executions` **[Number][105]** The times the recurrent payment will be executed - minimum 2.
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Let's send @ilnegro 5 STEEM a day
if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestConversion(
    null,
    'ilnegro',
    '5.000',
    'STEEM',
    memo,
    24,
    7,
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

#### requestSwap

Request swap

##### Parameters

- `username` **[String][101]** Steem account to perform the request (optional, default `null`)
- `startToken` **[String][101]** Incoming token
- `endToken` **[String][101]** Outgoing token
- `amount` **[number][105]** Amount of tokens to be swapped
- `slippage` **[number][105]** Max slippage
- `steps` **[Object][106]** Steps returned by KeychainSDK.swaps.getEstimation(), of type IStep\[]
- `callback` **[requestCallback][102]** Function that handles Keychain's response to the request
- `rpc` **[String][101]** Override user's RPC settings (optional, default `null`)

##### Examples

```javascript
// Let's swap 5 STEEM to DEC
// Estimated steps can be obtained via KeychainSDK.swaps.getEstimation()

if (window.steem_keychain) {
  const keychain = window.steem_keychain;
  keychain.requestSwap(
    'keychain',
    'STEEM',
    'DEC',
    5,
    1,
    estimatedSteps,
    (response) => {
      console.log(response);
    },
  );
} else {
  alert('You do not have steem keychain installed');
}
```

## requestCallback

Type: [Function][100]

### Parameters

- `response` **[Object][106]** Keychain's response to the request

[1]: #about-keychain
[2]: #usage
[3]: #operations
[4]: #steem_keychain
[5]: #requesthandshake
[6]: #parameters
[7]: #requestencodemessage
[8]: #parameters-1
[9]: #examples
[10]: #requestencodewithkeys
[11]: #parameters-2
[12]: #examples-1
[13]: #requestverifykey
[14]: #parameters-3
[15]: #examples-2
[16]: #requestsignbuffer
[17]: #parameters-4
[18]: #requestaddaccountauthority
[19]: #parameters-5
[20]: #examples-3
[21]: #requestremoveaccountauthority
[22]: #parameters-6
[23]: #examples-4
[24]: #requestaddkeyauthority
[25]: #parameters-7
[26]: #examples-5
[27]: #requestremovekeyauthority
[28]: #parameters-8
[29]: #examples-6
[30]: #requestbroadcast
[31]: #parameters-9
[32]: #examples-7
[33]: #requestsigntx
[34]: #parameters-10
[35]: #examples-8
[36]: #requestsignedcall
[37]: #parameters-11
[38]: #requestpost
[39]: #parameters-12
[40]: #examples-9
[41]: #requestvote
[42]: #parameters-13
[43]: #examples-10
[44]: #requestcustomjson
[45]: #parameters-14
[46]: #examples-11
[47]: #requesttransfer
[48]: #parameters-15
[49]: #examples-12
[50]: #requestsendtoken
[51]: #parameters-16
[52]: #examples-13
[53]: #requestdelegation
[54]: #parameters-17
[55]: #examples-14
[56]: #requestwitnessvote
[57]: #parameters-18
[58]: #examples-15
[59]: #requestproxy
[60]: #parameters-19
[61]: #examples-16
[62]: #requestpowerup
[63]: #parameters-20
[64]: #examples-17
[65]: #requestpowerdown
[66]: #parameters-21
[67]: #examples-18
[68]: #requestcreateclaimedaccount
[69]: #parameters-22
[70]: #requestcreateproposal
[71]: #parameters-23
[72]: #examples-19
[73]: #requestremoveproposal
[74]: #parameters-24
[75]: #examples-20
[76]: #requestupdateproposalvote
[77]: #parameters-25
[78]: #examples-21
[79]: #requestaddaccount
[80]: #parameters-26
[81]: #examples-22
[82]: #requestconversion
[83]: #parameters-27
[84]: #examples-23
[85]: #requestrecurrenttransfer
[86]: #parameters-28
[87]: #examples-24
[88]: #requestswap
[89]: #parameters-29
[90]: #examples-25
[91]: #requestcallback
[92]: #parameters-30
[93]: http://u.cubeupload.com/arcange/yOdI5g.png
[94]: https://chrome.google.com/webstore/detail/steemkeychain/jhgnbkkiafpaallpehbohjmkbjofjdmeid
[95]: https://addons.mozilla.org/en-GB/firefox/addon/steemkeychain/
[96]: http://localhost:1337/main.html
[97]: https://github.com/drov0/downvote-control-tools-front/blob/c453b81d482421e5ae006c25502c491dbebdc180/src/components/Login.js#L34
[98]: https://github.com/drov0/downvote-control-tool-back/blob/master/routes/auth.js#L159
[99]: https://www.npmjs.com/package/@hiveio/keychain
[100]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
[101]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[102]: #requestcallback
[103]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[104]: https://steempro.com/utopian-io/@stoodkev/how-to-set-up-and-use-multisignature-accounts-on-steem-blockchain
[105]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[106]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[107]: https://developers.steem.io/apidefinitions/#broadcast_ops_comment_options
[108]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
