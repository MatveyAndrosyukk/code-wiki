import React, {useCallback, useEffect, useRef} from "react";
import {User} from "../../store/slices/userSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {addUserWhoCanEdit} from "../../store/thunks/user/addUserWhoCanEdit";
import {deleteUserWhoCanEdit} from "../../store/thunks/user/deleteUserWhoCanEdit";
import {changeUserName} from "../../store/thunks/user/changeUserName";

export default function useUserModalActions(
    user: User | null,
    loginState: any
) {
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [isEditedNameLong, setIsEditedNameLong] = React.useState(false);
    const [addEditorError, setAddEditorError] = React.useState('');
    const [changeNameError, setChangeNameError] = React.useState('');
    const [editedName, setEditedName] = React.useState(user?.name || '');
    const nameInputRef = React.useRef<HTMLInputElement>(null);
    const [usersWhoCanEdit, setUsersWhoCanEdit] = React.useState(user?.whoCanEdit || []);
    const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
    const userModalInputRef = useRef<HTMLInputElement>(null);
    const [userModalValue, setUserModalValue] = React.useState('');

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
            nameInputRef.current.disabled = false;
        }
    }, [isEditingName]);

    useEffect(() => {
        if (editedName.length > 25) {
            setIsEditedNameLong(true)
        } else {
            setIsEditedNameLong(false)
        }
    }, [editedName]);

    useEffect(() => {
        if (userModalValue.trim() === '' && user?.whoCanEdit) {
            setUsersWhoCanEdit(user?.whoCanEdit);
        }
    }, [userModalValue, user?.whoCanEdit]);

    const closeUserModalHandler = () => {
        setIsUserModalOpen(false);
        setUserModalValue('')
        setAddEditorError('')
        setChangeNameError('')
    }

    const openUserModalHandler = () => {
        if (!loginState.isLoggedIn) {
            loginState.openLoginModal()
            return;
        }

        setIsUserModalOpen(true);
    }

    const addUserWhoCanEditHandler = useCallback(() => {
        const currentUserEmail = localStorage.getItem('email');
        dispatch(addUserWhoCanEdit({
            userEmail: currentUserEmail as string,
            whoCanEditEmail: userModalValue
        }))
            .unwrap()
            .then(() => {
                setAddEditorError('')
                setUserModalValue('')
            })
            .catch((e) => setAddEditorError(e.message));
    }, [dispatch, userModalValue, setUserModalValue])

    const deleteUserWhoCanEditHandler = useCallback((targetEmail: string) => {
        const currentUserEmail = localStorage.getItem('email');
        dispatch(deleteUserWhoCanEdit({
            userEmail: currentUserEmail as string,
            whoCanEditEmail: targetEmail
        }))
    }, [dispatch])

    const nameEditConfirmHandler = () => {
        dispatch(changeUserName({
            name: editedName,
            email: user?.email as string
        }))
            .unwrap()
            .then(() => {
                setIsEditingName(false);
            })
            .catch((e) => setChangeNameError(e.message));
    }

    const nameKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            nameEditConfirmHandler()
        }
        if (e.key === 'Escape') {
            setIsEditingName(false);
            setEditedName(user?.name || '')
        }
    }

    const nameEditBlurHandler = () => {
        setIsEditingName(false)
        setEditedName(user?.name || '')
        setChangeNameError('')
    }

    return {
        isEditingName,
        setIsEditingName,
        editedName,
        setEditedName,
        isEditedNameLong,
        nameInputRef,
        changeNameError,
        addEditorError,
        usersWhoCanEdit,
        onKeyDown: nameKeyDownHandler,
        onBlur: nameEditBlurHandler,
        addUserWhoCanEdit: addUserWhoCanEditHandler,
        deleteUserWhoCanEdit: deleteUserWhoCanEditHandler,
        onCloseModal: closeUserModalHandler,
        onOpenModal: openUserModalHandler,
        isModalOpen: isUserModalOpen,
        modalInputRef: userModalInputRef,
        modalValue: userModalValue,
        setModalValue: setUserModalValue,
    }
}