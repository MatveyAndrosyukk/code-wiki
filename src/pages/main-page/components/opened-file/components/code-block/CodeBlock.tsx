import React, {FC, useEffect, useRef} from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/custom-theme-5.css';

interface CodeBlockProps {
    code: string;
}

const CodeBlock: FC<CodeBlockProps> = ({code}) => {
    const codeRef = useRef(null);
    useEffect(() => {
        if (codeRef.current) {
            hljs.highlightElement(codeRef.current)
        }
    }, [])

    return (
        <pre
            style={{
                maxHeight: 500,
                overflowY: 'auto',
                borderRadius: '6px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#8D9191 #191A1A',
            }}>
            <code
                style={{
                    whiteSpace: 'pre',
                    display: 'block'
                }} ref={codeRef}>
                {code}
            </code>
        </pre>
    );
};

export default CodeBlock;