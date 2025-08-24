import React, {FC} from 'react';
import styles from './TerminalBlock.module.css'

interface TerminalBlockProps {
    commands: string;
}

const TerminalBlock: FC<TerminalBlockProps> = ({commands}) => {
    const lines = commands.split('\n');
    const promptRegex = /^([a-zA-Z0-9_.@\-\\:/\s]+[>$])\s?(.*)$/;

    return (
        <pre className={styles['terminal-block']}>
            <div className={styles['terminal-block-header']}>
                Terminal
            </div>
            {lines.map((line, i) => {
                const match = line.match(promptRegex);
                if (match) {
                    return (
                        <div key={i}>
                            <span style={{color: '#577B0F'}}>{match[1]} </span>
                            <span>{match[2]}</span>
                        </div>
                    );
                } else {
                    return <div key={i}>{line}</div>;
                }
            })}
    </pre>
    );
};

export default TerminalBlock;

