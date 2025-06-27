import getMessage from 'src/background/utils/i18n.utils';
import React from 'react';
import ButtonComponent from 'src/common-ui/button/button.component';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';

export const ErrorFallback = ({ error, theme, chain }: any) => {
  const formattedErrorMessage = `
    \`\`\` 
    ${error.message} \n\r
    ${error.stack} \n\r
    \`\`\`
    `;

  const handleClickOnCopy = async () => {
    await navigator.clipboard.writeText(formattedErrorMessage);
	window.open('https://discord.gg/sPgu3C5YKC', '_blank');
  };

  return (
    <div className="error-page">
      <SVGIcon icon={SVGIcons.MESSAGE_ERROR} />
      <div className="title">
        {getMessage('error_message_title')}
      </div>

      <div className="detail">
        <div className="message">{error.message.toString()}</div>
        <div className="stack">{error.stack.toString()}</div>
      </div>
      <ButtonComponent
        onClick={() => handleClickOnCopy()}
        label="html_popup_copy_error"
      />
    </div>
  );
};
