import React, {useContext, useEffect, useRef, useState} from 'react';
import searchFilesByName, {SearchResult} from "../../../../../../utils/functions/searchFilesByName";
import styles from './SearchInput.module.scss'
import FileImage from './images/search-input-file.svg'
import FolderImage from './images/search-input-folder.svg'
import {FileType} from "../../../../../../types/file";
import {SearchType} from "../../../../../../types/searchType";
import searchFilesByContent from "../../../../../../utils/functions/searchFilesByContent";
import {AppContext} from "../../../../../../context/AppContext";

interface SearchProps {
    onClick: (id: number) => void;
    searchType: SearchType;
}

const SearchInput: React.FC<SearchProps> = ({onClick, searchType}) => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {files} = context;
    const [query, setQuery] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const searchInputBlockRef = useRef<HTMLDivElement>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 720);

    useEffect(() => {
        function handleResize() {
            setIsNarrowScreen(window.innerWidth < 457);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        let found;
        if (searchType === SearchType.InFileNames) {
            found = searchFilesByName(files, query.trim());
        } else {
            found = searchFilesByContent(files, query.trim());
        }
        setResults(found);
    }, [query, files, searchType]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchInputBlockRef.current &&
                !searchInputBlockRef.current.contains(event.target as Node)
            ) {
                setIsInputFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const placeholderText = isNarrowScreen
        ? (searchType === SearchType.InFileNames
            ? "Files..."
            : "Text...")
        : (searchType === SearchType.InFileNames
            ? "Search for files..."
            : "Search for file content...");

    return (
        <div className={styles["search-input"]} ref={searchInputBlockRef}>
            <input
                type="text"
                placeholder={placeholderText}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                className={styles["search-input__field"]}
            />
            {(isInputFocused && results.length > 0) && (
                <ul className={styles["search-input__list"]}>
                    {results.map(({id, type, fullPath, content}) => (
                        <li
                            key={id}
                            title={fullPath}
                            onClick={() => onClick(id)}
                            className={styles["search-input__item"]}
                        >
                            <img
                                className={styles["search-input__icon"]}
                                src={type === FileType.Folder ? FolderImage : FileImage}
                                alt='FileImage'
                            />
                            <span
                                className={styles["search-input__text"]}
                                title={searchType === SearchType.InFileContents ? fullPath : undefined}
                            >
                                {searchType === SearchType.InFileNames ? fullPath : content}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchInput;