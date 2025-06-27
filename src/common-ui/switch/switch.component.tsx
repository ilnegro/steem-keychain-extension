import getMessage from 'src/background/utils/i18n.utils';
import { Switch } from 'pretty-checkbox-react';
import React from 'react';
import { SVGIcons } from 'src/common-ui/icons.enum';

interface SwitchProps {
  onChange: (value: any) => void;
  selectedValue: any;
  leftValue: any;
  rightValue: any;
  leftValueIcon?: SVGIcons;
  rightValueIcon?: SVGIcons;
  leftValueLabel?: string;
  rightValueLabel?: string;
  skipLeftTranslation?: boolean;
  skipRightTranslation?: boolean;
  hint?: string;
  skipHintTranslation?: boolean;
  dataTestId?: string;
}

const SwitchComponent = (props: SwitchProps) => {
  return (
    <div className="switch-container">
      <div className="switch-panel">
        {props.leftValueLabel && (
          <span>
            {props.skipLeftTranslation
              ? props.leftValueLabel
              : getMessage(props.leftValueLabel)}
          </span>
        )}
        <Switch
          data-testid={`switch-${props.dataTestId}`}
          style={{ fontSize: 18 }}
          onChange={(e) => {
            props.onChange(
              e.target.checked ? props.rightValue : props.leftValue,
            );
          }}
          checked={props.selectedValue === props.rightValue}
          className={
            props.selectedValue === props.rightValue ? 'checked' : 'not-checked'
          }></Switch>
        {props.rightValueLabel && (
          <span>
            {props.skipRightTranslation
              ? props.rightValueLabel
              : getMessage(props.rightValueLabel)}
          </span>
        )}
      </div>

      {props.hint && (
        <div className="hint">
          {props.skipHintTranslation
            ? props.hint
            : getMessage(props.hint)}
        </div>
      )}
    </div>
  );
};

export default SwitchComponent;
