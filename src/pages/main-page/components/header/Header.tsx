import React, {FC, useState} from 'react';
import styles from './Header.module.css'
import headerLogo from './images/header-logo.svg'
import headerSearch from './images/header-search.svg'
import headerSwap from './images/header-swap.svg'
import headerUser from './images/header-user.svg'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {openPathToNode} from "../../../../store/slices/fileTreeSlice";
import SearchInput from "./components/search-input/SearchInput";
import {SearchType} from "../../../../types/searchType";

const Header:FC = () => {
    const files = useSelector((state: RootState) => state.fileTree.files)
    const dispatch = useDispatch();
    const [searchType, setSearchType] = useState<SearchType>(SearchType.InFileNames);

    const selectHandler = (id: number) => {
        dispatch(openPathToNode({ id }));
    };

    const setSearchTypeHandler = () => {
        if (searchType === SearchType.InFileNames){
            setSearchType(SearchType.InFileContents);
        } else {
            setSearchType(SearchType.InFileNames);
        }
    }

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
                                    onSelect={selectHandler}
                                    searchType={searchType}
                                />
                                <img className={styles['header__search-loop']} src={headerSearch} alt="Search"/>
                            </div>
                            <img
                                className={styles['header__search-swap']}
                                onClick={setSearchTypeHandler}
                                src={headerSwap}
                                alt="Swap"
                            />
                        </div>
                        <div className={styles['header__logout']}>
                            <a href="/">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;