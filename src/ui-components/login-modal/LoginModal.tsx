import React, {FC, useCallback, useContext} from 'react';
import styles from './LoginModal.module.scss'
import modalStyles from '../modal/ModalContent.module.scss'
import Modal from "../modal/Modal";
import {AppContext} from "../../context/AppContext";
import CustomGoogleButton from "../custom-google-button/CustomGoogleButton";
import {ReactComponent as SwitchAuthSvg} from './images/login-modal-switch-auth.svg';

const LoginModal: FC = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component must be used within AppProvider");
    const {authState} = context;
    const {
        isLoginModalOpen,
        handleCloseAuthModal,
        isRegisterModal,
        registerError,
        loginError,
        loginModalInputRef,
        loginLoading,
        registerModalValue,
        loginModalValue,
        loginMessage,
        registerMessage,
        setIsEnterEmailModalOpened,
        handleChangeEmailInput,
        handleChangePasswordInput,
        handleChangeRePasswordInput,
        handleSwitchAuthorization,
        handleAuthorize,
        getAuthorizationText,
    } = authState;

    const handleOpenEnterEmailModal = useCallback(() => {
        handleCloseAuthModal()
        setIsEnterEmailModalOpened(true);
    }, [handleCloseAuthModal, setIsEnterEmailModalOpened])

    if (!isLoginModalOpen) return null;

    return (
        <Modal
            isOpen={isLoginModalOpen}
            onClose={handleCloseAuthModal}
        >
            <div className={`${modalStyles['modal__overlay']} ${styles['login-modal__overlay']}`}>
                <div className={`${modalStyles['modal__form']} ${styles['login-modal__form']}`}>
                    <div className={`${styles['login-modal__header']}`}>
                        <p className={`${styles['login-modal__form-text']}`}>
                            {isRegisterModal ? 'Register' : 'Login'}</p>
                        <SwitchAuthSvg
                            className={`${styles['login-modal__switch']}`}
                            onClick={handleSwitchAuthorization}/>
                    </div>
                    <div className={
                        loginMessage || registerMessage
                            ? modalStyles.modal__message
                            : (loginError || registerError)
                                ? modalStyles.modal__error
                                : `${modalStyles.modal__message} ${modalStyles.hidden}`
                    }>
                        {loginMessage || registerMessage || loginError || registerError}</div>
                    <input
                        ref={loginModalInputRef}
                        type='text'
                        className={`${modalStyles['modal__input']}`}
                        placeholder={"Enter your email"}
                        value={isRegisterModal ? registerModalValue.email : loginModalValue.login}
                        onChange={(e) => handleChangeEmailInput(e)}
                    />
                    <input
                        type='password'
                        className={`${modalStyles['modal__input']}`}
                        placeholder={"Enter your password"}
                        value={isRegisterModal ? registerModalValue.password : loginModalValue.password}
                        onChange={(e) => handleChangePasswordInput(e)}
                    />
                    {isRegisterModal &&
                        <input
                            type='password'
                            className={`${modalStyles['modal__input']}`}
                            placeholder={"Repeat your password"}
                            value={registerModalValue.rePassword}
                            onChange={(e) => handleChangeRePasswordInput(e)}
                        />
                    }
                    <div className={`${styles['login-modal__footer']}`}>
                        <div className={`${styles['footer__left']}`}>
                            <p
                                className={`${styles['login-modal__forgot-password']}`}
                                onClick={handleOpenEnterEmailModal}>
                                Forgot password?
                            </p>
                        </div>
                        <div className={`${styles['footer__center']}`}>
                            <button
                                className={`${modalStyles.modal__button}`}
                                disabled={loginLoading}
                                onClick={handleAuthorize}>
                                {getAuthorizationText()}
                            </button>
                        </div>
                        <div className={`${styles['footer__right']}`}>
                            <CustomGoogleButton/>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default LoginModal;