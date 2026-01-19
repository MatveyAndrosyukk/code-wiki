import React, {FC, useContext} from 'react';
import Modal from "../modal/Modal";
import modalStyles from '../modal/ModalContent.module.scss'
import styles from './BanModal.module.scss'
import {AppContext} from "../../context/AppContext";
import {ReactComponent as SwitchModeSvg} from './images/ban-modal-switch-auth.svg';
import {BanMode} from "../../utils/hooks/useBanActions";

interface BanModalProps {

}

const BanModal: FC<BanModalProps> = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {banState, viewedUser} = context;
    const {
        isBanModalOpened,
        handleCloseBanModal,
        banModalMessage,
        banModalError,
        banModalInputRef,
        banModalValue,
        banModalLoading,
        banModalMode,
        handleChangeBanModalValue,
        handleSwitchBanMode,
        handleBanOrUnbanUser,
        getButtonText
    } = banState

    return (
        <Modal
            isOpen={isBanModalOpened}
            onClose={handleCloseBanModal}
        >
            <div className={`${['modalStyles.modal__overlay']} ${styles['ban-modal__overlay']}`}>
                <div className={`${modalStyles['modal__form']} ${styles['ban-modal__form']}`}>
                    <div className={`${modalStyles['modal__header']}`}>
                        {banModalMode === BanMode.ban ?
                            <p className={`${modalStyles['modal__title']} ${styles['ban-modal__title']}`}>
                                Ban user <span className={`${styles['ban-modal__user']}`}>{viewedUser?.email}</span>
                            </p> :
                            <p className={`${modalStyles['modal__title']} ${styles['ban-modal__title']}`}>
                                Unban user <span className={`${styles['ban-modal__user']}`}>{viewedUser?.email}</span>
                            </p>}
                        <p className={
                            banModalMessage ? modalStyles.modal__message
                                : banModalError
                                    ? modalStyles.modal__error
                                    : `${modalStyles.modal__message} ${modalStyles.hidden}`
                        }>
                            {banModalMessage || banModalError}</p>
                        <SwitchModeSvg
                            className={`${styles['ban-modal__switch']}`}
                            onClick={() => handleSwitchBanMode()}/>
                    </div>
                    <div className={`${styles['ban-modal__body']}`}>
                        {banModalMode === BanMode.ban &&
                            <input
                                ref={banModalInputRef}
                                type='text'
                                className={`${modalStyles['modal__input']} ${styles['ban-modal__input-input']}`}
                                placeholder={"Enter a ban reason"}
                                value={banModalValue}
                                disabled={banModalLoading}
                                onChange={(e) => handleChangeBanModalValue(e)}
                            />}
                        <button
                            className={`${modalStyles['modal__button']} ${styles['ban-modal__button-button']}`}
                            disabled={banModalMode === BanMode.ban && (banModalLoading || !banModalValue.trim())}
                            onClick={handleBanOrUnbanUser}>
                            {getButtonText()}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BanModal;