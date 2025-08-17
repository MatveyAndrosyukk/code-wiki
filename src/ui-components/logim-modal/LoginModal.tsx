import React, {FC, useState} from 'react';
import styles from './LoginModal.module.css'
import modalStyles from '../modal/ModalContent.module.css'
import Modal from "../modal/Modal";

interface LoginModalProps {
    isModalOpen: boolean;
    onCloseModal: () => void;
    modalValue: { login: string, password: string };
    setModalValue: (value: { login: string, password: string }) => void;
    modalInputRef: any;
    onLogin: () => void;
}

const LoginModal: FC<LoginModalProps> = (
    {
        isModalOpen,
        onCloseModal,
        modalValue,
        setModalValue,
        modalInputRef,
        onLogin
    }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            onLogin()
            setLoading(false);
        }catch (error){
            setError('Authorization failed, try again');
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
        setError(null);
        onCloseModal();
    }

    if (!isModalOpen) return null;

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isCentered={true}
        >
            <div className={`${modalStyles.modal__overlay} ${styles.modal__overlay}`}>
                <div className={`${modalStyles.modal__form} ${styles.modal__form}`}>
                    <p className={`${styles['modal__form-text']}`}>Login</p>
                    <p className={error ? `${styles.modal__error}` : `${styles.modal__error} ${styles.hidden}`}>{error}</p>
                    <input
                        ref={modalInputRef}
                        type='text'
                        className={styles['modal__input']}
                        placeholder={"Enter your email"}
                        value={modalValue.login}
                        onChange={(e) => setModalValue({...modalValue, login: e.currentTarget.value})}
                    />
                    <input
                        ref={modalInputRef}
                        type='password'
                        className={styles['modal__input']}
                        placeholder={"Enter your password"}
                        value={modalValue.password}
                        onChange={(e) => setModalValue({...modalValue, password: e.currentTarget.value})}
                    />
                    <button
                        className={`${styles.modal__button}`}
                        disabled={loading}
                        onClick={handleLogin}
                    >
                        {loading ? 'Logining...' : 'Login'}
                    </button>
                </div>
            </div>
        </Modal>
    )
};

export default LoginModal;