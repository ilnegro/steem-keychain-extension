import getMessage from 'src/background/utils/i18n.utils';
import React from 'react';

interface AutocompleteProps {
  value: string;
  translateValue?: boolean;
  subLabel?: string;
  translateSublabel?: boolean;
  onItemClick: (value: string) => void;
}

const AutocompleteItemComponent = ({
  value,
  translateValue,
  subLabel,
  translateSublabel,
  onItemClick,
}: AutocompleteProps) => {
  return (
    <div
      className="autocomplete-item"
      key={value}
      onClick={() => onItemClick(value)}>
      {translateValue ? getMessage(value) : value}{' '}
      {subLabel && subLabel.trim().length > 0
        ? `(${translateSublabel ? getMessage(subLabel) : subLabel})`
        : ''}
    </div>
  );
};

export default AutocompleteItemComponent;
