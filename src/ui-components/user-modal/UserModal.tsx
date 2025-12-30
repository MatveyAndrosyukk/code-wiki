import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import styles from './UserModal.module.scss'
import commonStyles from '../../styles/Common.module.scss'
import modalStyles from '../modal/ModalContent.module.scss'
import Modal from "../modal/Modal";
import CopyLinkSvg from './images/user-modal-copyLink.svg'
import DeleteUserSvg from './images/user-modal-delete.svg'
import {User} from "../../store/slices/userSlice";
import {AppContext} from "../../context/AppContext";
import {UserModalState} from "../../utils/hooks/useUserModalActions";
import {useNavigate} from "react-router-dom";

interface LoginModalProps {
    userModalState: UserModalState
}

const UserModal: FC<LoginModalProps> = (
    {
        userModalState,
    }) => {
    const navigate = useNavigate();
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {loggedInUser} = context;
    const [isScreenSmall, setIsScreenSmall] = useState<boolean>(window.innerWidth <= 750);
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const {
        isEditingName,
        setIsEditingName,
        editedName,
        setEditedName,
        editedNameError,
        nameInputRef,
        changeNameError,
        addEditorError,
        usersWhoCanEdit,
        isUserModalOpen,
        setIsUserModalOpen,
        userModalInputRef,
        userModalValue,
        setUserModalValue,
        handleKeyDownWhileEditing,
        handleBlurNameAfterEdition,
        handleAddUserWhoCanEdit,
        handleDeleteUserWhoCanEdit,
        handleCloseUserModal,
    } = userModalState

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSmall(window.innerWidth <= 750);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCopyProfileLink = useCallback(() => {
        if (!loggedInUser?.email) return;

        const profileUrl = `${window.location.origin}/${loggedInUser.email}`;
        navigator.clipboard.writeText(profileUrl).catch(console.error);

        setShowCopyMessage(true);

        setTimeout(() => {
            setShowCopyMessage(false);
        }, 3000);
    }, [loggedInUser]);

    const handleGoToUsersPage = useCallback((user: User) => {
        navigate(`/${encodeURIComponent(user.email)}`);
        setUserModalValue('')
        setIsUserModalOpen(false);
    }, [navigate, setIsUserModalOpen, setUserModalValue])

    if (!isUserModalOpen) return null;

    return (
        <Modal
            isOpen={isUserModalOpen}
            onClose={handleCloseUserModal}
        >
            <div className={`${modalStyles.modal__overlay} ${styles.modal__overlay}`}>
                <div className={`${modalStyles.modal__form} ${styles.modal__form}`}>
                    <div className={styles['modal__head']}>
                        {showCopyMessage && (
                            <div className={commonStyles['common__notification']}>
                                Link copied to clipboard
                            </div>
                        )}
                        <div className={styles['modal__head-name']}>
                            <div className={styles['modal__name']}>
                                {isEditingName ? (
                                    <div>
                                        {editedNameError ? (
                                            <p className={styles['modal__name-symbol-error']}>
                                                {editedNameError}
                                            </p>
                                        ) : (
                                            <p className={styles['modal__name-invisible-error']}>
                                                Username is too long
                                            </p>
                                        )}
                                        <input
                                            ref={nameInputRef}
                                            className={styles['modal__name-change-input']}
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            onKeyDown={handleKeyDownWhileEditing}
                                            onBlur={handleBlurNameAfterEdition}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <p className={styles['modal__name-invisible-error']}>
                                            Username is too long
                                        </p>
                                        <div className={styles['modal__username']}>
                                            <div
                                                onClick={() => setIsEditingName(true)}
                                                className={styles['modal__username-name']}>
                                                {loggedInUser?.name}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={styles['modal__email']}>
                                {"(" + loggedInUser?.email + ")"}
                            </div>
                            {changeNameError ? (
                                <p
                                    className={`${styles['modal__name-symbol-error']} ${styles['modal__email-error']}`}
                                >
                                    {changeNameError}
                                </p>
                            ) : (
                                <p className={`${styles['modal__name-invisible-error']} ${styles['modal__email-error']}`}>
                                    Username is too long
                                </p>
                            )}
                        </div>
                        <div className={styles['modal__head-link']}>
                            <img
                                src={CopyLinkSvg}
                                alt="Copy link"
                                title="Copy profile link"
                                className={styles['modal__head-link-icon']}
                                onClick={handleCopyProfileLink}
                            />
                        </div>
                    </div>
                    <div className={styles['modal__editors-manager']}>
                        <div className={styles['editors-manager__title']}>

                        </div>
                        <div className={styles['editors-manager__body']}>
                            <input
                                ref={userModalInputRef}
                                type="text"
                                className={`${styles['modal__input']} ${styles['editors-manager-input']}`}
                                placeholder='Permit edition by email'
                                value={userModalValue}
                                onChange={(e) => setUserModalValue(e.target.value)}
                            />
                            <button
                                className={styles['editors-manager-button']}
                                onClick={handleAddUserWhoCanEdit}
                            >
                                Permit
                            </button>
                        </div>
                    </div>
                    {addEditorError ? (
                        <p className={`${styles['modal__name-symbol-error']} ${styles['modal__email-error']}`}>
                            {addEditorError}
                        </p>) : (
                        <p className={`${styles['modal__name-symbol-error']} ${styles['modal__email-error']}`}
                           style={{color: 'transparent'}}>
                            User with this email does not exist
                        </p>)}
                    <div
                        className={styles['modal__editors']}
                        style={usersWhoCanEdit.length > 3 ? {overflowY: "auto"} : {overflowY: "hidden"}}>
                        {usersWhoCanEdit.map((user: User) => (
                            <div
                                key={user.email}
                                className={styles['editor']}
                                onClick={() => handleGoToUsersPage(user)}>
                                <div className={styles['editor__left']}>
                                    <div className={styles['editor__left-name']}>
                                        {user.name}
                                    </div>
                                    <div className={styles['editor__left-email']}>
                                        {`(${user.email})`}
                                    </div>
                                </div>
                                <div className={styles['editor__right']}>
                                    <img
                                        alt={'Delete this user'}
                                        onClick={(event) => handleDeleteUserWhoCanEdit(user.email, event)}
                                        src={DeleteUserSvg}
                                        className={styles['editor__right-delete']}>
                                    </img>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default UserModal;