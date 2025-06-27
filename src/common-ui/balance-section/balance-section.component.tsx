import getMessage from 'src/background/utils/i18n.utils';
import React from 'react';
import FormatUtils from 'src/utils/format.utils';

interface Props {
  value: number | string;
  unit: string;
  label?: string;
  decimals?: number;
  skipLabelTranslation?: boolean;
  user?: string;
}

export const BalanceSectionComponent = ({
  value,
  unit,
  label,
  skipLabelTranslation,
  decimals = 3,
  user,
  }: Props) => {
  const effectiveDecimals = unit === 'TIME' ? 4 : decimals;
  return (
    <div className="balance-section">
      {label && (
        <div className="label">
          {skipLabelTranslation ? label : getMessage(label)}
        </div>
      )}
	  {user && <div className="user">{user}</div>} 
      <div className="value">
        {FormatUtils.formatCurrencyValue(value, effectiveDecimals)} {unit}
      </div>
    </div>
  );
};
