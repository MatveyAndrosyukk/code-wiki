import React, {useEffect, useRef, useState} from 'react';
import searchFilesByName, {SearchResult} from "./utils/searchFilesByName";
import styles from './SearchInput.module.css'
import FileImage from './images/search-input-file.svg'
import FolderImage from './images/search-input-folder.svg'
import {File, FileType} from "../../../../../../types/file";
import {SearchType} from "../../../../../../types/searchType";
import searchFilesByContent from "./utils/searchFilesByContent";

interface SearchProps {
    files: File[];
    onSelect: (id: number) => void;
    searchType: SearchType;
}

const SearchInput: React.FC<SearchProps> = (
    {
        files,
        onSelect,
        searchType,
    }
) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles["SearchInput"]} ref={containerRef}>
            <input
                type="text"
                placeholder={searchType === SearchType.InFileNames ? "Search for files..." : "Search for file content..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className={styles["SearchInput__input"]}
            />
            {(isFocused && results.length > 0) && (
                <ul className={styles["SearchInput__list"]}>
                    {results.map(({id, type, fullPath, content}) => (
                        <li
                            key={id}
                            title={fullPath}
                            onClick={() => {
                                onSelect(id);
                            }}
                            className={styles["SearchInput__item"]}
                        >
                            <img className={styles["SearchInput__icon"]}
                                 src={type === FileType.Folder ? FolderImage : FileImage}
                                 alt='FileImage'/>

                            <span className={styles["SearchInput__text"]}
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