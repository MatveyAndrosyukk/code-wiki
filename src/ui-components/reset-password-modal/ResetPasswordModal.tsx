import React, {FC, useCallback, useContext, useEffect} from 'react';
import Modal from "../modal/Modal";
import {AppContext} from "../../context/AppContext";
import styles from "./ResetPasswordModal.module.scss"
import modalStyles from "../modal/ModalContent.module.scss"
import {ReactComponent as CloseModalSvg} from "./images/reset-password-modal-close.svg"

interface ResetPasswordModalProps {
    resetToken: string | undefined;
}

const ResetPasswordModal: FC<ResetPasswordModalProps> = ({resetToken}) => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component must be used within AppProvider");
    const {authState} = context;

    const {
        isResetPasswordModalOpened,
        setIsResetPasswordModalOpened,
        resetPasswordError,
        setResetPasswordError,
        resetPasswordValue,
        setResetPasswordValue,
        resetPasswordLoading,
        newPasswordInputRef,
        resetPasswordMessage,
        handleChangeNewPassword,
        handleChangeRepeatPassword,
        handleClickResetPassword,
        handleBlurNewPassword,
        handleBlurRepeatPassword,
    } = authState;

    const handleCloseResetPasswordModal = useCallback(() => {
        setIsResetPasswordModalOpened(false);
        setResetPasswordValue({
            newPassword: '',
            repeatPassword: '',
        })
    }, [setIsResetPasswordModalOpened, setResetPasswordValue])

    useEffect(() => {
        if (isResetPasswordModalOpened) {
            const ref = newPasswordInputRef as React.RefObject<HTMLInputElement>;
            ref.current?.focus();
            setResetPasswordError('');
        }
    }, [isResetPasswordModalOpened, newPasswordInputRef, setResetPasswordError]);

    return (
        <Modal
            isOpen={isResetPasswordModalOpened}
            onClose={() => {
            }}>
            <div className={`${modalStyles['modal__overlay']}`}>
                <div className={`${modalStyles['modal__form']}`}>
                    <div className={`${modalStyles['modal__header']} ${styles['modal__header']}`}>
                        <p className={`${modalStyles['modal__title']}`}>
                            Password recovery
                        </p>
                        <CloseModalSvg
                            className={`${styles['modal__close']}`}
                            onClick={handleCloseResetPasswordModal}/>
                    </div>
                    <p className={
                        resetPasswordMessage ? modalStyles.modal__message
                            : resetPasswordError
                                ? modalStyles.modal__error
                                : `${modalStyles.modal__message} ${modalStyles.hidden}`
                    }>
                        {resetPasswordMessage || resetPasswordError}</p>
                    <div className={`${styles['modal__body']}`}>
                        <input
                            type='password'
                            className={`${modalStyles['modal__input']}`}
                            placeholder={"Enter a new password"}
                            value={resetPasswordValue.newPassword}
                            ref={newPasswordInputRef}
                            onBlur={handleBlurNewPassword}
                            onChange={(e) => handleChangeNewPassword(e)}
                        />
                        <input
                            type='password'
                            className={`${modalStyles['modal__input']}`}
                            placeholder={"Repeat a new password"}
                            value={resetPasswordValue.repeatPassword}
                            onBlur={handleBlurRepeatPassword}
                            onChange={(e) => handleChangeRepeatPassword(e)}
                        />
                        <button
                            className={`${modalStyles['modal__button']} ${styles['modal__button-button']}`}
                            disabled={resetPasswordLoading}
                            onClick={() => handleClickResetPassword(resetToken)}>
                            {resetPasswordLoading ? 'Reset...' : 'Reset'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ResetPasswordModal;