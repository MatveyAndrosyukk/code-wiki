import {useGoogleLogin} from '@react-oauth/google';
import {useContext} from "react";
import {AppContext} from "../../context/AppContext";
import styles from './CustomGoogleButton.module.scss'
import {ReactComponent as CustomGoogleButtonSvg} from './images/custom-google-button.svg'

const CustomGoogleButton = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("MainPage must be used within AppProvider");
    const {authState} = context;

    const {
        handleGoogleSuccess,
        handleGoogleError
    } = authState;

    const handleGoogleAuthResult = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    return (
        <CustomGoogleButtonSvg
            className={`${styles['customGoogleButton']}`}
            onClick={() => handleGoogleAuthResult()}/>
    );
};

export default CustomGoogleButton;