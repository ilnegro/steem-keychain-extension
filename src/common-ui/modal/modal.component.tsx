import getMessage from 'src/background/utils/i18n.utils';
import React from 'react';
import { PopupContainer } from 'src/common-ui/popup-container/popup-container.component';

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  title: string;
}

export const ModalComponent = ({ children, title }: ModalProps) => {
  return (
    <PopupContainer className="modal-container">
      <div className="modal-title">{getMessage(title)}</div>
      <div className="modal-content">{children}</div>
    </PopupContainer>
  );
};
