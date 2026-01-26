import styles from '../../pages/main-page/components/opened-file/OpenedFile.module.scss'
import React, {ReactNode} from "react";
import CodeBlock from "../../pages/main-page/components/opened-file/components/code-block/CodeBlock";
import TerminalBlock from "../../pages/main-page/components/opened-file/components/terminal-block/TerminalBlock";

function parseInline(
    text: string,
    onImageClick: (imageUrl: string) => void | null): React.ReactNode[] {
    const parts: React.ReactNode[] = [];

    const imageRegx = /\[image\/(.+?)]/g;
    const linkRegx = /\[`l to="([^"]+)"`](.+?)\[`\/l`]/g;
    const simpleTagsRegex = /\[`([ubi])`]([\s\S]+?)\[`\/\1`]/g;
    const lineCode = /\[`lc`](.*?)\[`\/lc`]/g;

    let lastIndex = 0;

    function findNextTag(text: string, startPos: number) {
        imageRegx.lastIndex = startPos;
        const imageMatch = imageRegx.exec(text);

        linkRegx.lastIndex = startPos;
        const linkMatch = linkRegx.exec(text);

        simpleTagsRegex.lastIndex = startPos;
        const simpleMatch = simpleTagsRegex.exec(text);

        lineCode.lastIndex = startPos;
        const lineCodeMatch = lineCode.exec(text);

        let matches = [
            imageMatch ? {type: 'image', match: imageMatch} : null,
            linkMatch ? {type: 'link', match: linkMatch} : null,
            simpleMatch ? {type: 'simple', match: simpleMatch} : null,
            lineCodeMatch ? {type: 'lineCode', match: lineCodeMatch} : null
        ].filter(Boolean) as { type: string, match: RegExpExecArray }[];

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
            const children = parseInline(innerContent, onImageClick);
            parts.push(
                <a key={index} className={styles['opened-file__content-link']} href={href} target="_blank"
                   rel="noopener noreferrer">
                    {children}
                </a>
            );
        } else if (type === 'simple') {
            const tag = match[1];
            const innerContent = match[2];
            const children = parseInline(innerContent, onImageClick);

            let className = '';
            switch (tag) {
                case 'u':
                    className = styles['opened-file__content--underline'];
                    break;
                case 'b':
                    className = styles['opened-file__content--bold'];
                    break;
                case 'i':
                    className = styles['opened-file__content--italic'];
                    break;
            }

            parts.push(
                <span key={index} className={className}>
                    {children}
                </span>
            );
        } else if (type === 'image') {
            const fileName = match[1].split(':')[0];
            console.log(fileName)
            const imageUrl = `https://i.ibb.co/${fileName}`;
            parts.push(
                <img
                    key={index}
                    src={imageUrl}
                    alt={fileName}
                    style={{maxWidth: '100%', height: 'auto'}}
                    onClick={() => onImageClick(imageUrl)}
                />
            );
        }else if (type === 'lineCode') {
            const innerContent = match[1];
            const children = parseInline(innerContent, onImageClick);
            parts.push(
                <span key={index} className={styles['opened-file__content-span-code']}>
            {children}
        </span>
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

export function parseFileTextToHTML(
    file: string,
    onImageClick: (imageUrl: string) => void | null,
    isFileTreeOpened: boolean,
): ReactNode[] {
    const lines = file.split('\n');

    const elements: ReactNode[] = [];

    let i = 0;
    const n = lines.length;

    while (i < n) {
        const line = lines[i].trim();

        if (line.startsWith('[`c`]')) {
            let codeLines: string[] = [];
            i++;
            while (i < n && !lines[i].startsWith('[`/c`]')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++;

            const codeText = codeLines.join('\n');
            elements.push(
                <div key={`code-${i}`} className={styles['opened-file__content-code']}>
                    <CodeBlock
                        code={codeText}
                        isFileTreeOpened={isFileTreeOpened}/>
                </div>
            );
            continue;
        }

        if (line.startsWith('[`t`]')) {
            let terminalLines: string[] = [];
            i++;
            while (i < n && !lines[i].startsWith('[`/t`]')) {
                terminalLines.push(lines[i]);
                i++;
            }
            i++;

            elements.push(
                <div key={`terminal-${i}`} className={styles['opened-file__content-terminal']}>
                    <TerminalBlock commands={terminalLines.join('\n')}/>
                </div>
            );
            continue;
        }

        if (line === '[`l`]') {
            elements.push(
                <div key={`line-${i}`} className={styles['opened-file__content-line']}/>
            );
            i++;
            continue;
        }

        if (line.startsWith('[`p`]')) {
            let pointLines: string[] = [];
            i++;
            while (i < n && !lines[i].startsWith('[`/p`]')) {
                pointLines.push(lines[i]);
                i++;
            }
            i++;
            elements.push(
                <div key={`point-${i}`} className={styles['opened-file__content-point']}>
                    {pointLines.join('\n')}
                </div>
            );
            continue;
        }

        if (line.length > 0) {
            elements.push(
                <div key={`text-${i}`} className={styles['opened-file__content-text']}>
                    {parseInline(line, onImageClick)}
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