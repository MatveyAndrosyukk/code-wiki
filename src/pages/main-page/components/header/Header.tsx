import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import styles from './Header.module.scss';
import {ReactComponent as LogoSvg} from './images/header-logo.svg';
import {ReactComponent as SearchSvg} from './images/header-search.svg';
import {ReactComponent as SwapSvg} from './images/header-swap.svg';
import {ReactComponent as UserSvg} from './images/header-user.svg';
import {ReactComponent as LogoutSvg} from './images/header-logout.svg';
import SearchInput from "./components/search-input/SearchInput";
import UserModal from '../../../../ui-components/user-modal/UserModal';
import useUserModalActions from "../../../../utils/hooks/useUserModalActions";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../../../context/AppContext";
import useFileSearchActions from "../../../../utils/hooks/useFileSearchActions";

const Header: FC = () => {
    const navigate = useNavigate();
    const context = useContext(AppContext);
    if (!context) throw new Error("Component must be used within AppProvider");
    const {authState, loggedInUser} = context;
    const fileSearch = useFileSearchActions();
    const userModalState = useUserModalActions(loggedInUser, authState);

    const {
        handleOpenUserModal,
    } = userModalState

    const {
        isLoggedIn,
        handleLogout,
        handleOpenLoginModal
    } = authState;

    const {
        searchType,
        handleSwitchSearchType,
        handleOpenPathToSelectedFile
    } = fileSearch;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 740);
    const [burgerOpen, setBurgerOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const burgerButtonRef = useRef<HTMLButtonElement | null>(null);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 740);
            if (window.innerWidth >= 740) {
                setBurgerOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
            burgerOpen &&
            menuRef.current &&
            !menuRef.current.contains(target) &&
            burgerButtonRef.current &&
            !burgerButtonRef.current.contains(target)
        ) {
            setBurgerOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [burgerOpen]);

    const handleBurgerToggle = () => {
        setBurgerOpen(!burgerOpen);
    };

    const handleRedirectToMainPage = () => {
        navigate('/');
    }

    return (
        <div className={styles['header']}>
            <div className={styles['header__container']}>
                <div className={styles['header__content']}>
                    <div className={styles['header__left']}>
                        <div
                            className={styles['header__logo']}
                            onClick={handleRedirectToMainPage}
                        >
                            <LogoSvg/>
                        </div>
                    </div>
                    <div className={styles['header__right']}>
                        <div className={styles['header__search']}>
                            <div className={styles['header__search-input']}>
                                <SearchInput
                                    onClick={handleOpenPathToSelectedFile}
                                    searchType={searchType}
                                />
                                <SearchSvg className={styles['header__search-icon']}/>
                            </div>
                            <SwapSvg
                                className={styles['header__search-swap']}
                                onClick={handleSwitchSearchType}/>
                        </div>

                        {isMobile ? (
                            <div className={styles['header__burger-container']}>
                                <button
                                    className={styles['header__burger-button']}
                                    onClick={handleBurgerToggle}
                                    aria-label="Toggle menu"
                                    ref={burgerButtonRef}
                                >
                                    &#9776;
                                </button>
                                {burgerOpen && (
                                    <div
                                        ref={menuRef}
                                        className={styles['header__burger-menu']}>
                                        <div className={styles['header__burger-item']}>
                                            <UserSvg onClick={handleOpenUserModal}/>
                                        </div>
                                        {isLoggedIn ? (
                                            <div className={styles['header__burger-item']}>
                                                <LogoutSvg onClick={handleLogout}/>
                                            </div>
                                        ) : (
                                            <button onClick={handleOpenLoginModal}>Login</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`${styles['header__buttons']}`}>
                                <div className={styles['header__user']}>
                                    <UserSvg
                                        onClick={handleOpenUserModal}/>
                                </div>

                                {isLoggedIn ? (
                                    <div
                                        className={styles['header__logout']}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </div>
                                ) : (
                                    <div
                                        className={styles['header__login']}
                                        onClick={handleOpenLoginModal}
                                    >
                                        Login
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <UserModal userModalState={userModalState}/>
        </div>
    );
};

export default Header;