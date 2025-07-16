import React, {useState, useRef, useEffect} from 'react';
import searchFiles, {SearchResult} from "./utils/searchFiles";
import styles from './SearchInput.module.css'
import FileImage from './images/search-input-file.svg'
import FolderImage from './images/search-input-folder.svg'
import {File, FileType} from "../../../../../../types/file"; // ваш импорт типов

interface SearchProps {
    files: File[];
    onSelect: (id: number) => void;
}

const SearchInput: React.FC<SearchProps> = ({files, onSelect}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        const found = searchFiles(files, query.trim()).slice(0, 10);
        setResults(found);
    }, [query, files]);

    // Закрыть список при клике вне компонента
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
                placeholder="Search for files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className={styles["SearchInput__input"]}
            />
            {(isFocused && results.length > 0) && (
                <ul className={styles["SearchInput__list"]}>
                    {results.map(({id, type, fullPath}) => (
                        <li
                            key={id}
                            title={fullPath}
                            onClick={() => {
                                onSelect(id);
                            }}
                            className={styles["SearchInput__item"]}
                        >
                            {/* Иконка файла или папки */}
                            <img className={styles["SearchInput__icon"]}
                                 src={type === FileType.Folder ? FolderImage : FileImage}
                                 alt='FileImage'/>

                            <span className={styles["SearchInput__text"]}>
            {fullPath}
          </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchInput;