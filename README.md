# Steem Keychain Extension

Secure Steem Wallet Extension.

Steem Keychain is an extension for accessing Steem-enabled distributed applications, or "dApps" in your Chromium or Firefox browser!

The extension injects the Steem Keychain API into every website's javascript context, so that dApps can read from the blockchain.

Steem Keychain also lets the user create and manage their own identities, so when a dApp wants to perform a transaction and write to the blockchain, the user gets a secure interface to review the transaction, before approving or rejecting it.

## Building locally

#### Clone the repository

`git clone https://github.com/ilnegro/steem-keychain-app`

#### Install the modules

`npm i`

#### Run the dev server

`npm run dev`
It will create two repositories `dist-dev` and `dist-dev-firefox`.
Alternatively, you can run the dev server for either browser by using `npm run dev:chromium` or `npm run dev:firefox`

#### Make a production build

`npm run build`
In the same manner, this will create `dist-prod` and `dist-prod-firefox` folders, and you can choose to build for one type of browser only by using `npm run build:chromium` or `npm run build:firefox`

#### Test your local build

##### Chromium

- Go to your browser extension page
- Activate the developer mode
- Load unpacked
- Choose the `dist-dev` folder

After making changes to the background, reload the extension.

##### Firefox

- Go to `about:debugging#/runtime/this-firefox`
- Load temporary Add-on
- Choose the `dist-dev-firefox` folder

After making changes to the background, reload the extension.

## Contributing

Before contributing to Steem Keychain, contact us on [Discord](https://discord.com/invite/Bsf98vMg6U).

## Useful links

- [Developers documentation](./documentation/README.md) for how to interact with Steem Keychain from your website
- [Contribution Guidelines](/CONTRIBUTING.md)
- [Landing page](https://keychain.steempro.com)
- [Support Discord](https://discord.com/invite/Bsf98vMg6U)
- [Keychain for Chromium browsers](https://chrome.google.com/webstore/detail/steemkeychain/jhgnbkkipaallpehbohjmkbjofjdmeid?hl=en)
- [Keychain for Firefox](https://addons.mozilla.org/en-US/firefox/addon/steemkeychain/)
