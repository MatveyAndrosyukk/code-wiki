import React, {FC, useCallback, useEffect, useRef} from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/custom-theme-9.css';
import styles from './CodeBlock.module.scss'
import {ReactComponent as ExpandCodeSvg} from './images/code-block-expand-code.svg'

interface CodeBlockProps {
    code: string;
}

const CodeBlock: FC<CodeBlockProps> = ({code}) => {
    const codeRef = useRef(null);
    const [isCodeExpanded, setIsCodeExpanded] = React.useState(false);

    const handleExpandCode = useCallback(() => {
        setIsCodeExpanded(!isCodeExpanded);
    }, [isCodeExpanded])

    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current)
        }
    }, [])

    return (
        <pre
            className={`${styles['code-block']} ${isCodeExpanded ? styles['code-block-expanded'] : ''}`}>
            <code
                className={`${styles['code-block__code']}`}
                ref={codeRef}>
                {code}
            </code>
            <div className={`${styles['code-block__expand']}`}>
                <ExpandCodeSvg
                    className={`${styles['code-block__expand-icon']}`}
                    onClick={handleExpandCode}/>
            </div>
        </pre>
    );
};

export default CodeBlock;