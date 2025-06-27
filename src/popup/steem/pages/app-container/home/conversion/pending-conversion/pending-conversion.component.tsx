import getMessage from 'src/background/utils/i18n.utils';
import { Conversion } from '@interfaces/conversion.interface';
import { setTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { Screen } from '@reference-data/screen.enum';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { CustomTooltip } from 'src/common-ui/custom-tooltip/custom-tooltip.component';

const PendingConversionPage = ({
  navParams,
  setTitleContainerProperties,
}: PropsFromRedux) => {
  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_pending_currency',
      titleParams: navParams.currency,
      isBackButtonEnabled: true,
    });
  }, []);

  return (
    <div
      className="pending-conversion-page"
      data-testid={`${Screen.PENDING_CONVERSION_PAGE}-page`}>
      <div className="list-panel">
        <div className="list">
          {navParams.pendingConversions.map((pendingConversion: Conversion) => (
            <CustomTooltip
              dataTestId="tooltip-timesteamp-pending-conversion"
              position="bottom"
              key={pendingConversion.id}
              message={getMessage(
                'popup_html_pending_currency_timestamp',
                [
                  moment
                    .utc(pendingConversion.conversion_date)
                    .local()
                    .format('L'),
                  moment
                    .utc(pendingConversion.conversion_date)
                    .local()
                    .format('LT'),
                ],
              )}
              skipTranslation>
              <div className="pending-conversion">
                <div className="expiration-date">
                  {moment
                    .utc(pendingConversion.conversion_date)
                    .local()
                    .format('L')}
                </div>
                <div className="amount">{pendingConversion.amount}</div>{' '}
              </div>
            </CustomTooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    navParams: state.navigation.stack[0].params,
  };
};

const connector = connect(mapStateToProps, {
  setTitleContainerProperties,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const PendingConersionPageComponent = connector(PendingConversionPage);
