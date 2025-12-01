import {ChangeEvent, Dispatch, SetStateAction, useCallback, useState} from "react";
import {performRegisterAsync} from "../../services/performRegisterAsync";

export interface RegisterModalState {
    email: string;
    password: string;
    rePassword: string;
}

export interface RegisterState {
    registerLoading: boolean;
    setRegisterLoading: Dispatch<SetStateAction<boolean>>;
    registerError: string | null,
    setRegisterError: Dispatch<SetStateAction<string | null>>;
    registerMessage: string | null,
    setRegisterMessage: Dispatch<SetStateAction<string | null>>;
    isRegisterModal: boolean;
    setIsRegisterModal: Dispatch<SetStateAction<boolean>>;
    registerModalValue: RegisterModalState;
    setRegisterModalValue: Dispatch<SetStateAction<RegisterModalState>>;
    handleChangeRePasswordInput: (e: ChangeEvent<HTMLInputElement>) => void;
    handleRegister: () => Promise<void>;
}

export default function useRegisterActions(): RegisterState {
    const [registerLoading, setRegisterLoading] = useState<boolean>(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerMessage, setRegisterMessage] = useState<string | null>(null);
    const [isRegisterModal, setIsRegisterModal] = useState<boolean>(false);
    const [registerModalValue, setRegisterModalValue] = useState<RegisterModalState>({
        email: '',
        password: '',
        rePassword: '',
    });

    const handleChangeRePasswordInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (isRegisterModal) {
            setRegisterModalValue({
                ...registerModalValue,
                rePassword: e.currentTarget.value
            });
        }
    }, [isRegisterModal, registerModalValue, setRegisterModalValue]);

    const handleRegister = useCallback(async (): Promise<void> => {
        const email = registerModalValue.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.length === 0 || !emailRegex.test(email)) {
            setRegisterError('Enter a valid email address');
            return;
        }
        if (registerModalValue.password.trim().length < 6 ||
            registerModalValue.rePassword.trim().length < 6) {
            setRegisterError('Password is too short');
            return;
        }
        if (registerModalValue.password !== registerModalValue.rePassword) {
            setRegisterError('Passwords do not match');
            return;
        }
        setRegisterLoading(true);
        setRegisterError(null);
        try {
            await performRegisterAsync(registerModalValue.email, registerModalValue.password).then(() => {
                setRegisterLoading(false);
                setIsRegisterModal(false);
                setRegisterError(null);
                setRegisterMessage('Confirmation link has been sent')
                setRegisterModalValue({email: '', password: '', rePassword: ''});
            });
        } catch (error) {
            setRegisterLoading(false);
            if (error instanceof Error) {
                setRegisterError(error.message);
            }
        }
    }, [registerModalValue, setRegisterError, setRegisterLoading]);

    return {
        registerLoading,
        setRegisterLoading,
        registerError,
        setRegisterError,
        registerMessage,
        setRegisterMessage,
        isRegisterModal,
        setIsRegisterModal,
        registerModalValue,
        setRegisterModalValue,
        handleChangeRePasswordInput,
        handleRegister,
    }
}