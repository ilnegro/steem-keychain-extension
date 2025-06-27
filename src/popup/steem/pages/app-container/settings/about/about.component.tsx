import getMessage from 'src/background/utils/i18n.utils';
import { setTitleContainerProperties } from '@popup/multichain/actions/title-container.actions';
import { RootState } from '@popup/multichain/store';
import { Screen } from '@reference-data/screen.enum';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { SVGIcons } from 'src/common-ui/icons.enum';
import manifestJson from '../../../../../../../manifest.json';

const AboutPage = ({ setTitleContainerProperties }: PropsFromRedux) => {
  useEffect(() => {
    setTitleContainerProperties({
      title: 'popup_html_about',
      isBackButtonEnabled: true,
    });
  }, []);

  return (
    <div data-testid={`${Screen.SETTINGS_ABOUT}-page`} className="about-page">
      <div
        data-testid={`${SVGIcons.MENU_ABOUT}-page-content`}
        className="content"
        dangerouslySetInnerHTML={{
          __html: getMessage('popup_html_about_text'),
        }}></div>
      <div className="version"><p><strong>
       {manifestJson.name + ' ' + manifestJson.version}
      </strong></p></div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, { setTitleContainerProperties });
type PropsFromRedux = ConnectedProps<typeof connector>;

export const AboutPageComponent = connector(AboutPage);
