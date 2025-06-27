import getMessage from 'src/background/utils/i18n.utils';
import { LocalStorageKeyEnum } from '@reference-data/local-storage-key.enum';
import React, { useEffect, useState } from 'react';
import ButtonComponent, {
  ButtonType,
} from 'src/common-ui/button/button.component';
import { SVGIcons } from 'src/common-ui/icons.enum';
import { PopupContainer } from 'src/common-ui/popup-container/popup-container.component';
import { SVGIcon } from 'src/common-ui/svg-icon/svg-icon.component';
import Config from 'src/config';
import LocalStorageUtils from 'src/utils/localStorage.utils';

const TutorialPopup = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const skipTutorial = await LocalStorageUtils.getValueFromLocalStorage(
      LocalStorageKeyEnum.SKIP_TUTORIAL,
    );
    if (!skipTutorial) {
      setShow(true);
    }
  };

const handleClick = async (option: 'show' | 'skip') => {
  if (option === 'show') {
    chrome.tabs.create({
      url: `${Config.tutorial.baseUrl}`,
    });
  }
  await LocalStorageUtils.saveValueInLocalStorage(
    LocalStorageKeyEnum.SKIP_TUTORIAL,
    true,
  );
  setShow(false);
};

  // if (!show) return null;

  return null;

  return (
    <PopupContainer data-testid="tutorial-popup" className="tutorial">
      <div className="popup-title">
        {getMessage('popup_html_tutorial_popup_title')}
      </div>

      <SVGIcon className="image" icon={SVGIcons.KEYCHAIN_LOGO_SPLASHSCREEN} />

      <div
        className="sub-title"
        dangerouslySetInnerHTML={{
          __html: getMessage(
            'popup_html_tutorial_popup_description',
          ),
        }}></div>
      <div className="popup-footer">
        <div className="buttons-container">
          <ButtonComponent
            label="popup_html_tutorial_popup_skip_label"
            type={ButtonType.ALTERNATIVE}
            onClick={() => handleClick('skip')}
            additionalClass="button"
          />
          <ButtonComponent
            label="popup_html_tutorial_popup_show_label"
            type={ButtonType.IMPORTANT}
            onClick={() => handleClick('show')}
            additionalClass="button"
          />
        </div>
      </div>
    </PopupContainer>
  );
};

export const TutorialPopupComponent = TutorialPopup;
