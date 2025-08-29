import React, {FC} from 'react';
import styles from './UserModal.module.css'
import modalStyles from '../modal/ModalContent.module.css'
import Modal from "../modal/Modal";
import editNameSvg from './images/user-modal-edit.svg'
import copyLinkSvg from './images/user-modal-copyLink.svg'
import userSvg from './images/user-modal-user.svg'
import {User} from "../../store/slices/userSlice";

interface LoginModalProps {
    userModalActions: any
    user: User | null;
}

const UserModal: FC<LoginModalProps> = (
    {
        userModalActions,
        user,
    }) => {

    const {
        isEditingName,
        setIsEditingName,
        editedName,
        setEditedName,
        isEditedNameLong,
        nameInputRef,
        changeNameError,
        addEditorError,
        usersWhoCanEdit,
        onKeyDown,
        onBlur,
        addUserWhoCanEdit,
        deleteUserWhoCanEdit,
        isModalOpen,
        onCloseModal,
        modalInputRef,
        modalValue,
        setModalValue,
    } = userModalActions

    const handleCopyProfileLink = () => {
        if (!user?.email) return;

        const profileUrl = `${window.location.origin}/${user.email}`;
        navigator.clipboard.writeText(profileUrl)
    };

    if (!isModalOpen) return null;

    return (
        <Modal
            isOpen={isModalOpen}
            onClose={onCloseModal}
        >
            <div className={`${modalStyles.modal__overlay} ${styles.modal__overlay}`}>
                <div className={`${modalStyles.modal__form} ${styles.modal__form}`}>
                    <div className={styles['modal__head']}>
                       <div className={`${styles['modal__head-name']}`}>
                           <div className={styles['modal__name']}>
                               {isEditingName ? (
                                   <div>
                                       {isEditedNameLong ? (
                                           <p className={styles['modal__name-symbolError']}>
                                               Username should be less than 25 symbols
                                           </p>
                                       ) : (
                                           <p className={styles['modal__name-invisibleError']}>
                                               Username should be less than 25 symbols
                                           </p>
                                       )}
                                       <input
                                           ref={nameInputRef}
                                           className={styles['modal__name-changeNameInput']}
                                           value={editedName}
                                           onChange={(e) => setEditedName(e.target.value)}
                                           onKeyDown={onKeyDown}
                                           onBlur={onBlur}
                                       />
                                   </div>
                               ) : (
                                   <div>
                                       <p className={styles['modal__name-invisibleError']}>
                                           Username should be less than 25 symbols
                                       </p>
                                       <div className={styles['modal__username']}>
                                           <div className={styles['modal__name-username']}>
                                               {user?.name}
                                           </div>
                                           <img
                                               src={editNameSvg}
                                               alt="Edit"
                                               title="Change name"
                                               className={styles['modal__name-image']}
                                               onClick={() => setIsEditingName(true)}
                                           />
                                       </div>
                                   </div>
                               )}
                           </div>
                           <div className={styles['modal__email']}>
                               {user?.email}
                           </div>
                           {changeNameError ? (
                               <p
                                   className={`${styles['modal__name-symbolError']} ${styles['modal__email-error']}`}
                               >
                                   {changeNameError}
                               </p>
                           ) : (
                               <p className={`${styles['modal__name-invisibleError']} ${styles['modal__email-error']}`}>
                                   Username should be less than 25 symbols
                               </p>
                           )}
                       </div>
                        <div className={`${styles['modal__head-link']}`}>
                            <img
                                src={copyLinkSvg}
                                alt='Copy link'
                                title='Copy profile link'
                                onClick={handleCopyProfileLink}
                            />
                        </div>
                    </div>
                    <p className={styles['modal__text']}>
                        Administer users who can edit your files:
                    </p>
                    <div className={styles['modal__permission']}>
                        <input
                            ref={modalInputRef}
                            type='text'
                            className={styles['modal__input']}
                            placeholder={"Email"}
                            value={modalValue}
                            onChange={(e) => setModalValue(e.target.value)}
                        />
                        <button
                            className={styles['modal__button']}
                            onClick={addUserWhoCanEdit}
                        >
                            Permit
                        </button>
                    </div>
                    {addEditorError ? (
                        <p className={`${styles['modal__name-symbolError']} ${styles['email-error']}`}>
                            {addEditorError}
                        </p>) : (
                        <p className={`${styles['modal__name-symbolError']} ${styles['email-error']}`}
                           style={{color: 'transparent'}}>
                            User with this email does not exist
                        </p>)}
                    <div className={styles['modal__users']}>
                        {usersWhoCanEdit.map((user: User) => (
                            <div
                                key={user.email}
                                className={styles['modal__user']}>
                                <div className={styles['modal__userLeftSide']}>
                                    <img src={userSvg} alt="" className={styles['modal__user-image']}/>
                                    <div className={styles['modal__userName']}>
                                        <div className={styles['modal__userName-name']}>
                                            {user.name}
                                        </div>
                                        <div className={styles['modal__userName-email']}>
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteUserWhoCanEdit(user.email)}
                                    className={styles['modal__user-delete']}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default UserModal;