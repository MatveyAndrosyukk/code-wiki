import React, {FC} from 'react';
import styles from './Header.module.css'
import headerLogo from './images/header-logo.svg'
import headerSearch from './images/header-search.svg'
import headerSwap from './images/header-swap.svg'
import headerUser from './images/header-user.svg'
import SearchInput from "./components/search-input/SearchInput";
import LoginModal from "../../../../ui-components/login-modal/LoginModal";
import {CreateFilePayload} from "../../../../store/thunks/createFileOnServer";
import UserModal from '../../../../ui-components/user-modal/UserModal';
import {User} from "../../../../store/slices/userSlice";
import useUserModalActions from "../../../../utils/hooks/useUserModalActions";
import {useNavigate} from "react-router-dom";

interface HeaderProps {
    loginState: any;
    fileSearch: any;
    files: CreateFilePayload[];
    user: User | null;
}

const Header: FC<HeaderProps> = (
    {
        loginState,
        fileSearch,
        files,
        user,
    }
) => {
    const navigate = useNavigate();
    const userModalActions = useUserModalActions(user, loginState);

    const handleLogoClick = () => {
        navigate('/');
    }

    return (
        <div className={styles['header']}>
            <div className={styles['container']}>
                <div className={styles['header__content']}>
                    <div className={styles['header__leftSide']}>
                        <div
                            className={styles['header__logo']}
                            onClick={handleLogoClick}
                        >
                            <img src={headerLogo} alt="Logo"/>
                        </div>
                    </div>
                    <div className={styles['header__rightSide']}>
                        <div className={styles['header__user']}>
                            <img
                                src={headerUser}
                                onClick={userModalActions.onOpenModal}
                                alt="User"
                            />
                        </div>
                        <div className={styles['header__search']}>
                            <div className={styles['header__search-input']}>
                                <SearchInput
                                    files={files}
                                    onSelect={fileSearch.selectHandler}
                                    searchType={fileSearch.searchType}
                                />
                                <img className={styles['header__search-loop']} src={headerSearch} alt="Search"/>
                            </div>
                            <img
                                className={styles['header__search-swap']}
                                onClick={fileSearch.onChangeSearchType}
                                src={headerSwap}
                                alt="Swap"
                            />
                        </div>
                        {loginState.isLoggedIn ? (
                            <div
                                className={`${styles.header__logout}`}
                                onClick={() => loginState.onLogout()}
                                style={{cursor: 'pointer'}}
                            >
                                Logout
                            </div>
                        ) : (
                            <div
                                className={`${styles.header__login}`}
                                onClick={() => loginState.openLoginModal()}
                                style={{cursor: 'pointer'}}
                            >
                                Login
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <LoginModal
                isModalOpen={loginState.isLoginModalOpen}
                onCloseModal={loginState.closeLoginModal}
                modalValue={loginState.loginModalValue}
                setModalValue={loginState.setLoginModalValue}
                modalInputRef={loginState.loginModalInputRef}
                onLogin={loginState.onLogin}
            />
            <UserModal
                user={user}
                userModalActions={userModalActions}
            />
        </div>
    );
};

export default Header;