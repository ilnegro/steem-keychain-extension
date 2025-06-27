import getMessage from 'src/background/utils/i18n.utils';
import { RootState } from '@popup/multichain/store';
import { Screen } from '@reference-data/screen.enum';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

const ImportKeys = ({}: PropsFromRedux) => {
  return (
    <div
      className="import-keys-page"
      data-testid={`${Screen.ACCOUNT_PAGE_IMPORT_KEYS}-page`}>
      {getMessage('popup_html_import_keys')}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const ImportKeysComponent = connector(ImportKeys);
