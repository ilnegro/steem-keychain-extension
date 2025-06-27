import { navigateTo } from '@popup/multichain/actions/navigation.actions';
import { ResetPasswordPageComponent } from '@popup/multichain/pages/sign-in/reset-password/reset-password.component';
import { SignInComponent } from '@popup/multichain/pages/sign-in/sign-in/sign-in.component';
import { RootState } from '@popup/multichain/store';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { PageTitleComponent } from 'src/common-ui/page-title/page-title.component';
import { Screen } from 'src/reference-data/screen.enum';

interface SignInRouterOwnProps {
  setIsUnlocked?: (value: boolean) => void;
}

interface SignInRouterProps extends PropsFromRedux, SignInRouterOwnProps {}

const SignInRouter = ({
  currentPage,
  navigateTo,
  titleProperties,
  hasTitle,
  setIsUnlocked,
}: SignInRouterProps) => {
  useEffect(() => {
    // console.log('[SignInRouter] Navigating to SIGN_IN_PAGE');
    navigateTo(Screen.SIGN_IN_PAGE);
  }, []);

  const renderSignInPage = (page: Screen) => {
    switch (page) {
      case Screen.RESET_PASSWORD_PAGE:
        return <ResetPasswordPageComponent />;
      default:
        return <SignInComponent setIsUnlocked={setIsUnlocked} />;
    }
  };

  return (
    <div
      className="sign-in-router-page"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '400px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
      }}>
      {hasTitle && (
        <PageTitleComponent
          title={titleProperties.title}
          titleParams={titleProperties.titleParams}
          skipTitleTranslation={titleProperties.skipTitleTranslation}
          isBackButtonEnabled={titleProperties.isBackButtonEnabled}
          isCloseButtonDisabled={titleProperties.isCloseButtonDisabled}
          style={{
            width: '100%',
            height: '70px',
            flexShrink: 0,
          }}
        />
      )}
      <div
        className="page-content"
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}>
        {renderSignInPage(currentPage!)}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    currentPage: state.navigation.stack[0]
      ? state.navigation.stack[0].currentPage
      : Screen.UNDEFINED,
    hasTitle: state.titleContainer?.title.length > 0,
    titleProperties: state.titleContainer,
  };
};

const connector = connect(mapStateToProps, { navigateTo });
type PropsFromRedux = ConnectedProps<typeof connector>;

export const SignInRouterComponent = connector(SignInRouter);