import { DynamicGlobalProperties } from '@hiveio/dhive';
import { SteemTxUtils } from '@popup/steem/utils/steem-tx.utils';

const getDynamicGlobalProperties =
  async (): Promise<DynamicGlobalProperties> => {
    return SteemTxUtils.getData(
      'condenser_api.get_dynamic_global_properties',
      [],
    );
  };

export const DynamicGlobalPropertiesUtils = {
  getDynamicGlobalProperties,
};
