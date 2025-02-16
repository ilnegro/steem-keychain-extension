import SettingsUtils from '@popup/steem/utils/settings.utils';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { MenuItem } from 'src/interfaces/menu-item.interface';

const ImportExportSubMenuItems: MenuItem[] = [
  {
    label: 'popup_html_import_permissions',
    icon: SVGIcons.MENU_ADVANCED_SETTINGS_IMPORT_SETTINGS,
    action: () => {
      SettingsUtils.importSettings();
    },
  },
  {
    label: 'popup_html_export_permissions',
    icon: SVGIcons.MENU_ADVANCED_SETTINGS_EXPORT_SETTINGS,
    action: () => {
      SettingsUtils.exportSettings();
    },
  },
];

export default ImportExportSubMenuItems;
