import React, {FC} from 'react';
import styles from './FileTree.module.css'
import fileTreeLock from './images/fileTree-lock.svg'

const FileTree:FC = () => {
    return (
        <div className={styles['fileTree']}>
            <div className={styles['fileTree__content']}>
                <div className={styles['fileTree__buttons']}>
                    <div className={styles['fileTree__buttons-create']}>
                        Create a root folder
                    </div>
                    <div className={styles['fileTree__buttons-lock']}>
                        <img src={fileTreeLock} alt="Lock"/>
                    </div>
                </div>
                <div className={styles['fileTree__files']}>

                </div>
            </div>
        </div>
    );
};

export default FileTree;