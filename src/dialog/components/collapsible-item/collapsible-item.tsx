import getMessage from 'src/background/utils/i18n.utils';
import React, { useState } from 'react';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';

type Props = {
  title: string;
  content: string;
  preContent?: string;
  pre?: boolean; // set pre to true if we are showing a pretty printed json
};

const CollaspsibleItem = ({ title, content, pre, preContent }: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <>
      <div
        className="collapsible-title"
        onClick={() => {
          setCollapsed(!collapsed);
        }}>
        <div
          className="label"
          dangerouslySetInnerHTML={{
            __html: getMessage(title),
          }}></div>
        <SVGIcon icon={SVGIcons.SELECT_ARROW_DOWN} />
      </div>
      <div className={collapsed ? 'hide' : 'field'}>
        {pre ? (
          <div className="operation_item_content">
            <pre>{content}</pre>
          </div>
        ) : (
          <div className="operation_item_content">{content}</div>
        )}
      </div>
    </>
  );
};

export default CollaspsibleItem;
