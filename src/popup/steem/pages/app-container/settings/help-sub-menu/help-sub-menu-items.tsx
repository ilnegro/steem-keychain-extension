import { MenuItem } from '@interfaces/menu-item.interface';
import { SVGIcons } from 'src/common-ui/icons.enum';
import Config from 'src/config';

const HelpSubMenuItems: MenuItem[] = [
  {
    label: 'popup_html_contact_support',
    icon: SVGIcons.MENU_SUPPORT,
    action: () => {
	  window.open('https://discord.gg/sPgu3C5YKC', '_blank');
    },
  },
  // {
  //   label: 'popup_html_tutorial',
  //   icon: SVGIcons.MENU_TUTORIAL,
  //   action: () => {
  //     chrome.tabs.create({ url: `${Config.tutorial.baseUrl}/#/extension` });
  //   },
  // },
];

export default HelpSubMenuItems;
