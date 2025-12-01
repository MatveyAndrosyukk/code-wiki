import {ChangeEvent, Dispatch, Ref, SetStateAction, useCallback, useRef, useState} from "react";
import {sendResetPasswordLinkAsync} from "../../services/sendResetPasswordLinkAsync";

export type EmailModalState = {
    isEnterEmailModalOpened: boolean;
    setIsEnterEmailModalOpened: Dispatch<SetStateAction<boolean>>;
    emailModalMessage: string;
    setEmailModalMessage: Dispatch<SetStateAction<string>>;
    emailModalError: string;
    setEmailModalError: Dispatch<SetStateAction<string>>;
    emailModalInputRef: Ref<HTMLInputElement | null> | null;
    emailModalValue: string;
    setEmailModalValue: Dispatch<SetStateAction<string>>;
    emailModalLoading: boolean;
    setEmailModalLoading: Dispatch<SetStateAction<boolean>>;
    handleSendChangePasswordLink: () => void;
    handleChangeEmailModalValue: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function useEmailModalActions(): EmailModalState {
    const [isEnterEmailModalOpened, setIsEnterEmailModalOpened] = useState(false);
    const [emailModalMessage, setEmailModalMessage] = useState<string>('');
    const [emailModalError, setEmailModalError] = useState<string>('');
    const emailModalInputRef = useRef<HTMLInputElement>(null)
    const [emailModalValue, setEmailModalValue] = useState<string>('');
    const [emailModalLoading, setEmailModalLoading] = useState(false);

    const handleSendChangePasswordLink = useCallback(async () => {
        setEmailModalError('');
        setEmailModalMessage('');

        const email = emailModalValue.trim();
        if (!email) {
            setEmailModalError('Email address is required');
            return;
        }
        setEmailModalLoading(true);
        try {
            await sendResetPasswordLinkAsync(email)
                .then(() => {
                    setEmailModalError('')
                    setEmailModalMessage('Reset link sent to your email.');
                    setEmailModalValue('');
                })
                .catch((error) => {
                    setEmailModalMessage('')
                    setEmailModalError(error.message);
                })
        } finally {
            setEmailModalLoading(false);
        }

    }, [emailModalValue])

    const handleChangeEmailModalValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setEmailModalValue(e.target.value);
    }, []);

    return {
        isEnterEmailModalOpened,
        setIsEnterEmailModalOpened,
        emailModalError,
        setEmailModalError,
        emailModalMessage,
        setEmailModalMessage,
        emailModalInputRef,
        emailModalValue,
        setEmailModalValue,
        emailModalLoading,
        setEmailModalLoading,
        handleSendChangePasswordLink,
        handleChangeEmailModalValue,
    }
}