import React, {FC} from 'react';
import Header from "./components/header/Header";
import styles from './Main.module.css'
import FileTree from "./components/file-tree/FileTree";

const Main: FC = () => {
    return (
        <div className={styles['main']}>
            <Header/>
            <div className={styles['container']}>
                <FileTree/>
            </div>
        </div>
    );
};

export default Main;