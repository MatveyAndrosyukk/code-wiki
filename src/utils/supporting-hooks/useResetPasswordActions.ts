import {ChangeEvent, Dispatch, Ref, SetStateAction, useCallback, useRef, useState} from "react";
import {resetPasswordAsync} from "../../services/resetPasswordAsync";

export interface ResetPasswordValueState {
    newPassword: string,
    repeatPassword: string,
}

export type ResetPasswordState = {
    isResetPasswordModalOpened: boolean;
    setIsResetPasswordModalOpened: Dispatch<SetStateAction<boolean>>;
    resetPasswordValue: ResetPasswordValueState;
    setResetPasswordValue: Dispatch<SetStateAction<ResetPasswordValueState>>;
    resetPasswordError: string;
    setResetPasswordError: Dispatch<SetStateAction<string>>;
    resetPasswordLoading: boolean;
    setResetPasswordLoading: Dispatch<SetStateAction<boolean>>;
    handleChangePassword: (resetToken: string | undefined) => void;
    handleChangeNewPassword: (e: ChangeEvent<HTMLInputElement>) => void;
    handleChangeRepeatPassword: (e: ChangeEvent<HTMLInputElement>) => void;
    newPasswordInputRef: Ref<HTMLInputElement | null> | null;
    handleBlurNewPassword: () => void;
    handleBlurRepeatPassword: () => void;
    resetPasswordMessage: string;
    setResetPasswordMessage: Dispatch<SetStateAction<string>>;
}

export default function useResetPasswordActions(): ResetPasswordState {
    const [isResetPasswordModalOpened, setIsResetPasswordModalOpened] = useState(false);
    const [resetPasswordValue, setResetPasswordValue] = useState<ResetPasswordValueState>({
        newPassword: '',
        repeatPassword: '',
    });
    const [resetPasswordError, setResetPasswordError] = useState<string>('');
    const [resetPasswordMessage, setResetPasswordMessage] = useState<string>('');
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
    const newPasswordInputRef = useRef<HTMLInputElement>(null);

    const handleChangePassword = useCallback(async (resetToken: string | undefined) => {
        const newPassword = resetPasswordValue.newPassword.trim();
        const repeatPassword = resetPasswordValue.repeatPassword.trim();

        if (newPassword.length < 6) {
            setResetPasswordError('Password is too short');
            return;
        }

        if (newPassword !== repeatPassword) {
            setResetPasswordError('Passwords do not match');
            return;
        }
        setResetPasswordLoading(true);
        setResetPasswordError('');

        if (!resetToken) {
            setResetPasswordError('Reset link not found');
            setResetPasswordLoading(false);
            return;
        }

        try {
            await resetPasswordAsync(resetToken, newPassword)
                .then(() => {
                    setResetPasswordError('')
                    setResetPasswordMessage('Password was reset successfully')
                })
                .catch(() => {
                    setResetPasswordMessage('')
                    setResetPasswordError('Invalid link, please try again');
                })
        } finally {
            setResetPasswordLoading(false);
        }
    }, [resetPasswordValue.newPassword, resetPasswordValue.repeatPassword])

    const handleChangeNewPassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setResetPasswordValue({...resetPasswordValue, newPassword: e.target.value});
    }, [resetPasswordValue])

    const handleChangeRepeatPassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setResetPasswordValue({...resetPasswordValue, repeatPassword: e.target.value})
    }, [resetPasswordValue])

    const handleBlurNewPassword = useCallback(() => {
        const pwd = resetPasswordValue.newPassword;
        if (!pwd || pwd.length < 6) {
            setResetPasswordError("Password is too short");
        } else {
            setResetPasswordError('');
        }
    }, [resetPasswordValue])

    const handleBlurRepeatPassword = useCallback(() => {
        if (resetPasswordValue.repeatPassword !== resetPasswordValue.newPassword) {
            setResetPasswordError("Passwords do not match");
        } else {
            setResetPasswordError('');
        }
    }, [resetPasswordValue])

    return {
        isResetPasswordModalOpened,
        setIsResetPasswordModalOpened,
        resetPasswordValue,
        setResetPasswordValue,
        resetPasswordError,
        setResetPasswordError,
        resetPasswordLoading,
        setResetPasswordLoading,
        handleChangePassword,
        handleChangeNewPassword,
        handleChangeRepeatPassword,
        newPasswordInputRef,
        handleBlurNewPassword,
        handleBlurRepeatPassword,
        resetPasswordMessage,
        setResetPasswordMessage,
    }
}