import {ChangeEvent, useCallback} from "react";
import useRegisterActions, {RegisterState} from "../supporting-hooks/useRegisterActions";
import useLoginActions, {LoginState} from "../supporting-hooks/useLoginActions";
import {CodeResponse} from "@react-oauth/google";
import {handleGoogleLogin} from "../../services/handleGoogleLogin";
import useEmailModalActions, {EmailModalState} from "../supporting-hooks/useEmailModalActions";
import useResetPasswordActions, {ResetPasswordState} from "../supporting-hooks/useResetPasswordActions";

export type AuthorizationState = RegisterState & EmailModalState & ResetPasswordState & LoginState & {
    handleChangeEmailInput: (e: ChangeEvent<HTMLInputElement>) => void;
    handleChangePasswordInput: (e: ChangeEvent<HTMLInputElement>) => void;
    handleAuthorize: () => void;
    handleSwitchAuthorization: () => void;
    handleCloseAuthModal: () => void;
    handleGoogleSuccess: (codeResponse: CodeResponse) => void;
    handleGoogleError: () => void;
    handleClickResetPassword: (resetToken: string | undefined) => void;
    getAuthorizationText: () => string;
}

export default function useAuthorizationActions(): AuthorizationState {
    const registerState = useRegisterActions();
    const loginState = useLoginActions();
    const emailModalState = useEmailModalActions();
    const resetPasswordState = useResetPasswordActions();

    const handleGoogleSuccess = (codeResponse: CodeResponse) => {
        const authorizationCode = codeResponse.code;

        handleGoogleLogin(authorizationCode)
            .then(() => {
                loginState.setIsLoggedIn(true);
                loginState.setIsLoginModalOpen(false);
            })
            .catch((error) => {
                console.error('Google login error', error);
            });
    };

    const handleGoogleError = () => {
        console.error('Google Login Failed');
    };

    const handleCloseAuthModal = useCallback(() => {
        loginState.setLoginModalValue({
            login: '',
            password: '',
        });
        loginState.setLoginError(null);
        loginState.setLoginMessage(null);
        registerState.setRegisterModalValue({
            email: '',
            password: '',
            rePassword: '',
        });
        registerState.setRegisterError(null);
        registerState.setRegisterMessage(null);
        loginState.setIsLoginModalOpen(false);
    }, [loginState, registerState]);

    const handleChangeEmailInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (registerState.isRegisterModal) {
            registerState.setRegisterModalValue({
                ...registerState.registerModalValue,
                email: e.currentTarget.value
            });
        } else {
            loginState.setLoginModalValue({
                ...loginState.loginModalValue,
                login: e.currentTarget.value
            });
        }
    }, [registerState, loginState]);

    const handleChangePasswordInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (registerState.isRegisterModal) {
            registerState.setRegisterModalValue({
                ...registerState.registerModalValue,
                password: e.currentTarget.value
            });
        } else {
            loginState.setLoginModalValue({
                ...loginState.loginModalValue,
                password: e.currentTarget.value
            });
        }
    }, [registerState, loginState]);

    const handleAuthorize = useCallback(() => {
        if (registerState.isRegisterModal) {
            registerState.handleRegister()
        } else {
            loginState.handleLogin()
                .then(() => handleCloseAuthModal())
                .catch((error) => {
                    loginState.setLoginMessage(null)
                    if (error instanceof Error) {
                        loginState.setLoginError(error.message);
                    }
                })
        }
    }, [registerState, loginState, handleCloseAuthModal]);

    const handleSwitchAuthorization = useCallback(() => {
        loginState.setLoginError(null);
        loginState.setLoginMessage(null);
        registerState.setRegisterError(null);
        registerState.setRegisterMessage(null);
        registerState.setIsRegisterModal(!registerState.isRegisterModal);
    }, [loginState, registerState]);

    const handleClickResetPassword = useCallback(async (resetToken: string | undefined) => {
        try {
            resetPasswordState.handleChangePassword(resetToken);
            loginState.setLoginModalValue({ login: '', password: '' });
            loginState.setLoginError(null);
            loginState.setLoginMessage('Password was reset successfully');
            resetPasswordState.setIsResetPasswordModalOpened(false);
            registerState.setIsRegisterModal(false);
            loginState.setIsLoginModalOpen(true);
        } catch (error) {
            console.error('Password reset error:', error);
        }
    }, [resetPasswordState, loginState, registerState]);

    const getAuthorizationText = () => {
        if (registerState.isRegisterModal) {
            return registerState.registerLoading ? 'Register...' : 'Register';
        } else {
            return loginState.loginLoading ? 'Login...' : 'Login';
        }
    };

    return {
        ...loginState,
        ...registerState,
        ...emailModalState,
        ...resetPasswordState,
        handleChangeEmailInput,
        handleChangePasswordInput,
        handleAuthorize,
        handleSwitchAuthorization,
        getAuthorizationText,
        handleCloseAuthModal,
        handleGoogleSuccess,
        handleGoogleError,
        handleClickResetPassword,
    }
}