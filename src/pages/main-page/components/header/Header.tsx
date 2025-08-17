import React, {FC} from 'react';
import styles from './Header.module.css'
import headerLogo from './images/header-logo.svg'
import headerSearch from './images/header-search.svg'
import headerSwap from './images/header-swap.svg'
import headerUser from './images/header-user.svg'
import SearchInput from "./components/search-input/SearchInput";
import LoginModal from "../../../../ui-components/logim-modal/LoginModal";
import {File} from "../../../../types/file";
import {CreateFilePayload} from "../../../../store/thunks/createFileOnServer";

interface HeaderProps {
    loginState: any;
    fileSearch: any;
    files: CreateFilePayload[];
}

const Header:FC<HeaderProps> = (
    {
        loginState,
        fileSearch,
        files,
    }
) => {
    return (
        <div className={styles['header']}>
            <div className={styles['container']}>
                <div className={styles['header__content']}>
                    <div className={styles['header__leftSide']}>
                        <div className={styles['header__logo']}>
                            <img src={headerLogo} alt="Logo"/>
                        </div>
                    </div>
                    <div className={styles['header__rightSide']}>
                        <div className={styles['header__user']}>
                            <img src={headerUser} alt="User"/>
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
                                style={{ cursor: 'pointer' }}
                            >
                                Logout
                            </div>
                        ) : (
                            <div
                                className={`${styles.header__login}`}
                                onClick={() => loginState.openLoginModal()}
                                style={{ cursor: 'pointer' }}
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
        </div>
    );
};

export default Header;