import getMessage from 'src/background/utils/i18n.utils';
import { Witness } from '@interfaces/witness.interface';
import { setErrorMessage } from '@popup/multichain/actions/message.actions';
import { RootState } from '@popup/multichain/store';
import { EditMyWitnessComponent } from '@popup/steem/pages/app-container/home/governance/my-witness-tab/edit-my-witness/edit-my-witness.component';
import { WitnessInformationComponent } from '@popup/steem/pages/app-container/home/governance/my-witness-tab/witness-information/witness-information.component';
import WitnessUtils from '@popup/steem/utils/witness.utils';
import React, { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { SVGIcons } from 'src/common-ui/icons.enum';
import RotatingLogoComponent from 'src/common-ui/rotating-logo/rotating-logo.component';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';

type Props = {
  ranking: Witness[];
};

const MyWitnessTab = ({
  ranking,
  globalProperties,
  activeAccount,
  currencyPrices,
  setErrorMessage,
}: PropsFromRedux & Props) => {
  const [witnessInfo, setWitnessInfo] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    try {
      const result = await WitnessUtils.getWitnessInfo(
        activeAccount.name!,
        globalProperties,
        currencyPrices,
      );

      setWitnessInfo(result);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('popup_html_error_retrieving_witness_information');
    }
  };

  return (
    <div className="my-witness-tab">
      {!isLoading &&
        witnessInfo &&
        (!editMode ? (
          <WitnessInformationComponent
            ranking={ranking}
            setEditMode={setEditMode}
            witnessInfo={witnessInfo}
          />
        ) : (
          <EditMyWitnessComponent
            setEditMode={setEditMode}
            witnessInfo={witnessInfo}
          />
        ))}
      {isLoading && (
        <div className="rotating-logo-container">
          <RotatingLogoComponent />
        </div>
      )}
      {hasError && (
        <div aria-label="error-witness" className="error-witness">
          <SVGIcon className="error-icon" icon={SVGIcons.MESSAGE_ERROR} />
          <span>
            {getMessage(
              'popup_html_error_retrieving_witness_information',
            )}
          </span>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    activeAccount: state.steem.activeAccount,
    globalProperties: state.steem.globalProperties,
    currencyPrices: state.steem.currencyPrices,
  };
};

const connector = connect(mapStateToProps, {
  setErrorMessage,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const MyWitnessTabComponent = connector(MyWitnessTab);
