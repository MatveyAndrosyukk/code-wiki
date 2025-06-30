import React from 'react';
import styles from './EmplyFile.module.css'

const EmptyFile = () => {
    return (
        <div className={styles['emptyFile']}>
            <div className={styles['emptyFile__content']}>
                <div className={styles['emptyFile__smileWrapper']}>
                    <svg
                        className={styles['emptyFile__smile']}
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="10" y="10" width="100" height="100" rx="25" stroke="#A0A0A0" strokeWidth="4" fill="none" />
                        <ellipse className={styles['eye']} cx="45" cy="55" rx="7" ry="9" fill="#A0A0A0"/>
                        <ellipse className={styles['eye']} cx="75" cy="55" rx="7" ry="9" fill="#A0A0A0"/>
                        <path d="M50 80 Q60 95 70 80" stroke="#A0A0A0" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    </svg>
                    <div className={styles['emptyFile__caption']}>
                        Open your file
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyFile;