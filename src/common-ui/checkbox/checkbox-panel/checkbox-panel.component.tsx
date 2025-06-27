import getMessage from 'src/background/utils/i18n.utils';
import React from 'react';
import CheckboxComponent, {
  CheckboxProps,
} from 'src/common-ui/checkbox/checkbox/checkbox.component';

export enum BackgroundType {
  TRANSPARENT = 'transparent',
  FILLED = 'filled',
}

interface CheckboxPanelProps extends CheckboxProps {
  backgroundType?: BackgroundType;
  hint?: string;
  skipHintTranslation?: boolean;
  text?: string;
  skipTextTranslation?: boolean;
  children?: JSX.Element;
}

export const CheckboxPanelComponent = (props: CheckboxPanelProps) => {
  return (
    <div
      className={`checkbox-panel ${
        props.backgroundType ?? BackgroundType.FILLED
      } ${props.hint ? 'has-hint' : ''} ${props.text ? 'has-text' : ''}`}>
      <CheckboxComponent {...props} />
      {props.children && props.children}
      {!props.children && (
        <>
          {props.hint && (
            <div
              className="hint"
              dangerouslySetInnerHTML={{
                __html: props.skipHintTranslation
                  ? props.hint
                  : getMessage(props.hint),
              }}></div>
          )}
          {props.text && (
            <div
              className="text"
              dangerouslySetInnerHTML={{
                __html: props.skipTextTranslation
                  ? props.text
                  : getMessage(props.text),
              }}></div>
          )}
        </>
      )}
    </div>
  );
};
