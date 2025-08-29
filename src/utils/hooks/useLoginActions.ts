import {useRef, useState} from "react";
import {login} from "../../api/auth";
import {jwtDecode} from "jwt-decode";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {resetFiles} from "../../store/slices/fileTreeSlice";

export default function useLoginActions() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginModalValue, setLoginModalValue] = useState({
        login: "",
        password: "",
    });
    const loginModalInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>();

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => {
        setLoginModalValue({
            login: "",
            password: "",
        })
        setIsLoginModalOpen(false);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('roles');
        dispatch(resetFiles())
        setIsLoggedIn(false);
    }

    const handleLogin = async () => {
        try {
            const data = await login(loginModalValue.login, loginModalValue.password);

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
            closeLoginModal();
        } catch (error) {
            throw error;
        }
    }

    return {
        isLoggedIn,
        setIsLoggedIn,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalValue,
        setLoginModalValue,
        loginModalInputRef,
        openLoginModal,
        closeLoginModal,
        onLogout: handleLogout,
        onLogin: handleLogin
    }
}