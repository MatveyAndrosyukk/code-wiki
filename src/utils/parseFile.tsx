import styles from '../pages/main-page/components/opened-file/OpenedFile.module.css'
import React, {ReactNode} from "react";
import CodeBlock from "../pages/main-page/components/opened-file/components/code-block/CodeBlock";
import TerminalBlock from "../pages/main-page/components/opened-file/components/terminal-block/TerminalBlock";

function parseInline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];

    const imageRegx = /\[image\/(.+?)]/g;
    const linkRegx = /\[```l to="([^"]+)"```](.+?)\[```\/l```]/g;
    const simpleTagsRegex = /\[```([ubi])```]([\s\S]+?)\[```\/\1```]/g;

    let lastIndex = 0;

    function findNextTag(text: string, startPos: number) {
        imageRegx.lastIndex = startPos;
        const imageMatch = imageRegx.exec(text);

        linkRegx.lastIndex = startPos;
        const linkMatch = linkRegx.exec(text);

        simpleTagsRegex.lastIndex = startPos;
        const simpleMatch = simpleTagsRegex.exec(text);

        // Находим ближайший матч из всех трех
        let matches = [
            imageMatch ? {type: 'image', match: imageMatch} : null,
            linkMatch ? {type: 'link', match: linkMatch} : null,
            simpleMatch ? {type: 'simple', match: simpleMatch} : null
        ].filter(Boolean) as {type: string, match: RegExpExecArray}[];

        if (matches.length === 0) return null;

        matches.sort((a, b) => a.match.index - b.match.index);

        return matches[0];
    }

    let nextTag = findNextTag(text, 0);

    while (nextTag) {
        const {type, match} = nextTag;
        const index = match.index;

        if (index > lastIndex) {
            parts.push(text.slice(lastIndex, index));
        }

        if (type === 'link') {
            const href = match[1];
            const innerContent = match[2];
            const children = parseInline(innerContent);
            parts.push(
                <a key={index} className={styles['openedFile__content-link']} href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        } else if (type === 'simple') {
            const tag = match[1];
            const innerContent = match[2];
            const children = parseInline(innerContent);

            let className = '';
            switch (tag) {
                case 'u':
                    className = styles['openedFile__content-underline'];
                    break;
                case 'b':
                    className = styles['openedFile__content-bold'];
                    break;
                case 'i':
                    className = styles['openedFile__content-italic'];
                    break;
            }

            parts.push(
                <span key={index} className={className}>
                    {children}
                </span>
            );
        } else if (type === 'image') {
            const fileName = match[1];
            const imageUrl = `http://localhost:3000/images/${fileName}`;
            parts.push(
                <img key={index} src={imageUrl} alt={fileName} style={{maxWidth: '100%', height: 'auto'}} />
            );
        }

        lastIndex = index + match[0].length;
        nextTag = findNextTag(text, lastIndex);
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

export function parseFileTextToHTML(file: string): ReactNode[] {
    const lines = file.split('\n');

    const elements: ReactNode[] = [];

    let i = 0;
    const n = lines.length;

    while (i < n) {
        const line = lines[i].trim();

        // [code*] ... [/code*]
        if (line.startsWith('[```code```]')) {
            let codeLines: string[] = [];
            i++;
            while (i < n && !lines[i].startsWith('[```/code```]')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++;

            const codeText = codeLines.join('\n');
            elements.push(
                <div key={`code-${i}`} className={styles['openedFile__content-code']}>
                    <CodeBlock code={codeText}/>
                </div>
            );
            continue;
        }

        // [terminal*] ... [/terminal*]
        if (line.startsWith('[```terminal```]')) {
            let terminalLines: string[] = [];
            i++;
            while (i < n && !lines[i].startsWith('[```/terminal```]')) {
                terminalLines.push(lines[i]);
                i++;
            }
            i++;

            elements.push(
                <div key={`terminal-${i}`} className={styles['openedFile__content-terminal']}>
                    <TerminalBlock commands={terminalLines.join('\n')}/>
                </div>
            );
            continue;
        }

        // [/divline*] — рисуем линию
        if (line === '[```line```]') {
            elements.push(
                <div key={`line-${i}`} className={styles['openedFile__content-line']}/>
            );
            i++;
            continue;
        }

        // [point*] ... [/point*]
        if (line.startsWith('[```point```]')) {
            let pointLines: string[] = [];
            i++;
            while (i < n && !lines[i].startsWith('[```/point```]')) {
                pointLines.push(lines[i]);
                i++;
            }
            i++;
            elements.push(
                <div key={`point-${i}`} className={styles['openedFile__content-point']}>
                    {pointLines.join('\n')}
                </div>
            );
            continue;
        }

        //Simple text with inline tags
        if (line.length > 0) {
            elements.push(
                <div key={`text-${i}`} className={styles['openedFile__content-text']}>
                    {parseInline(line)}
                </div>
            );
            i++;
            continue;
        }

        elements.push(<div key={`empty-${i}`} style={{height: 8}}/>);
        i++;
    }

    return elements;
}