import {Dispatch, Ref, SetStateAction, useCallback, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {performLoginAsync} from "../../services/performLoginAsync";
import {jwtDecode} from "jwt-decode";
import {resetFiles} from "../../store/slices/fileTreeSlice";

export interface LoginModalValue {
    login: string;
    password: string;
}

export interface LoginState {
    loginLoading: boolean;
    setLoginLoading: Dispatch<SetStateAction<boolean>>;
    loginError: string | null;
    setLoginError: Dispatch<SetStateAction<string | null>>;
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    isLoginModalOpen: boolean;
    setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
    loginModalValue: LoginModalValue;
    setLoginModalValue: Dispatch<SetStateAction<LoginModalValue>>;
    loginMessage: string | null;
    setLoginMessage: Dispatch<SetStateAction<string | null>>;
    loginModalInputRef: Ref<HTMLInputElement | null> | null;
    handleOpenLoginModal: () => void;
    handleLogout: () => void;
    handleLogin: () => Promise<void>;
}

export default function useLoginActions(): LoginState {
    const dispatch = useDispatch<AppDispatch>();
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [loginMessage, setLoginMessage] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const loginModalInputRef = useRef<HTMLInputElement>(null);
    const [loginModalValue, setLoginModalValue] = useState<LoginModalValue>({
        login: "",
        password: "",
    });

    const handleOpenLoginModal = useCallback(() => {
        setIsLoginModalOpen(true);
    }, [setIsLoginModalOpen]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('roles');
        dispatch(resetFiles());
        setIsLoggedIn(false);
    }, [dispatch, setIsLoggedIn]);

    const handleLogin = useCallback(async () => {
        const login = async () => {
            try {
                const data = await performLoginAsync(loginModalValue.login, loginModalValue.password);

                type JwtPayload = {
                    email: string;
                    roles: { id: number; value: string; description: string }[];
                    iat: number;
                    exp: number;
                };

                const decoded: JwtPayload = jwtDecode(data.token);
                const roleValues = decoded.roles.map(role => role.value);

                localStorage.setItem('token', data.token);
                localStorage.setItem('email', decoded.email);
                localStorage.setItem('roles', JSON.stringify(roleValues));

                setIsLoggedIn(true);
            } catch (error) {
                throw error;
            }
        }

        setLoginLoading(true);
        setLoginError(null);
        try {
            await login();
            setLoginLoading(false);
        } catch (error) {
            setLoginLoading(false);
            throw error;
        }
    }, [loginModalValue.login, loginModalValue.password]);

    return {
        loginLoading,
        setLoginLoading,
        loginError,
        setLoginError,
        isLoggedIn,
        setIsLoggedIn,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalValue,
        setLoginModalValue,
        loginMessage,
        setLoginMessage,
        loginModalInputRef,
        handleOpenLoginModal,
        handleLogout,
        handleLogin,
    }
}