import getMessage from 'src/background/utils/i18n.utils';
import React from 'react';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';

const ServiceUnavailablePage = () => (
  <div className="service-unavailable-page">
    <SVGIcon icon={SVGIcons.MESSAGE_ERROR} />
    <div className="text">
      {getMessage('service_unavailable_message')}
    </div>
  </div>
);

export default ServiceUnavailablePage;
