import { App } from '@capacitor/app';
import getMessage from 'src/background/utils/i18n.utils';
import { forgetMk } from '@popup/multichain/actions/mk.actions';
import { resetNav } from '@popup/multichain/actions/navigation.actions';
import { RootState } from '@popup/multichain/store';
import { WitnessVotingSectionComponent } from '@popup/steem/pages/app-container/home/voting-section/witness-voting-section/witness-voting-section.component';
import { Theme, useThemeContext } from '@popup/theme.context';
import { Screen } from '@reference-data/screen.enum';
import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { MenuComponent } from 'src/common-ui/menu/menu.component';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';
import SettingsMenuItems from './settings-main-page-menu-items';

const SettingsMainPage = ({ forgetMk, resetNav }: PropsFromRedux) => {
  const { toggleTheme, theme } = useThemeContext();

  const goToDiscord = () => {
	window.open('https://discord.gg/eFeUcBgkBg', '_blank');  
  };
  const goToSteemPro = () => {
	window.open('https://www.steemit.com/@time.foundation', '_blank');  
  };
  const goToTwitter = () => {
	window.open('https://twitter.com/ilnegro_max', '_blank');  
  };
//  const logout = () => {
//    forgetMk();
//	resetNav();
//  };
  
  const logout = async () => {
    // console.log('Logout chiamato');
    forgetMk();
    // console.log('forgetMk eseguito');
    try {
      await App.exitApp(); // Chiude l'app
      // console.log('App chiusa');
    } catch (error) {
      console.error('Errore durante la chiusura dell\'app:', error);
    }
  };  
  
  const getIcon = () =>
    theme === Theme.DARK ? SVGIcons.MENU_THEME_LIGHT : SVGIcons.MENU_THEME_DARK;
  return (
    <div
      className="settings-main-page"
      data-testid={`${Screen.SETTINGS_MAIN_PAGE}-page`}>
      {/* <div className="love-text">
        {getMessage('html_popup_made_with_love_by_faisalamin')}
      </div> */}
      <MenuComponent
        title="popup_html_settings"
        isBackButtonEnable={true}
        rightAction={{
          icon: getIcon(),
          callback: toggleTheme,
          className: 'menu-toggle-theme',
        }}
        showDetachWindowOption
        isCloseButtonDisabled
        menuItems={SettingsMenuItems(logout)}></MenuComponent>
      <WitnessVotingSectionComponent />
      <div className="link-panel">
        <SVGIcon
          className="network-icon"
          icon={SVGIcons.MENU_BOTTOM_BAR_DISCORD}
          onClick={goToDiscord}
          hoverable
        />
        <SVGIcon
          className="network-icon"
          icon={SVGIcons.MENU_BOTTOM_BAR_STEEM}
          onClick={goToSteemPro}
          hoverable
        />
        <SVGIcon
          className="network-icon"
          icon={SVGIcons.MENU_BOTTOM_BAR_TWITTER}
          onClick={goToTwitter}
          hoverable
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const connector = connect(mapStateToProps, {
  forgetMk,
  resetNav,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

export const SettingsMainPageComponent = connector(SettingsMainPage);
