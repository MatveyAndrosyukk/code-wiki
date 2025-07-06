import React, {FC} from 'react';
import styles from './OpenedFile.module.css'
import LikeBtn from './images/opened-file-like.svg'
import DownloadBtn from './images/opened-file-download.svg'
import {File} from "../../../../types/file";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {parseFile} from "./utils/parseFile";
import findFilePath from "./utils/findFilePath";

interface OpenedFileProps {
    file: File;
}

const OpenedFile: FC<OpenedFileProps> = ({file}) => {
    const files = useSelector((state: RootState) => state.fileTree.files);
    // Возвращает массив file.name от корневой папки до файла.
    const filePath = findFilePath(files, file.id)?.join('/')
    // Функция парсит content файла и собирает блоки в массив.
    const contentElements = parseFile(file.content);
    return (
        // Часть каждого файла по дефолту.
        <div className={styles['openedFile']}>
            <div className={styles['openedFile__header']}>
                <div className={styles['openedFile__leftSide']}>
                    <div className={styles['openedFile__leftSide-likes']}>
                        <div className={styles['openedFile__leftSide-likes-amount']}>
                            {file.likes}
                        </div>
                        <img src={LikeBtn} alt="Like"/>
                    </div>
                    <div className={styles['openedFile__leftSide-title']}>
                        <div className={styles['openedFile__leftSide-title-email']}>
                            {file.author}
                        </div>
                        <span>|</span>
                        <div
                            className={styles['openedFile__leftSide-title-path']}
                            title={filePath}>
                            {filePath}
                        </div>
                    </div>
                </div>
                <div className={styles['openedFile__rightSide']}>
                    <div className={styles['openedFile__rightSide-download']}>
                        <img src={DownloadBtn} alt="Download"/>
                    </div>
                    <div className={styles['openedFile__rightSide-like']}>
                        Like
                    </div>
                    <div className={styles['openedFile__rightSide-edit']}>
                        Edit
                    </div>
                    <div className={styles['openedFile__rightSide-delete']}>
                        Delete
                    </div>
                </div>
            </div>
            {/*Контент, который спарсили функцией parseFile().*/}
            <div className={styles['openedFile__content']}>
                {contentElements}
            </div>
        </div>
    );
};

export default OpenedFile;