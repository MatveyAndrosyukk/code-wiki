import styles from '../pages/main-page/components/opened-file/OpenedFile.module.css'
import {ReactNode} from "react";
import CodeBlock from "../pages/main-page/components/opened-file/components/code-block/CodeBlock";
import TerminalBlock from "../pages/main-page/components/opened-file/components/terminal-block/TerminalBlock";

// Рекурсивный парсер для inline тегов
function parseInline(text: string): ReactNode[] {
    // Регулярное выражение для поиска [tag*]...[/tag*]
    const regex = /\[(underline|bold|italic)\*](.+?)\[\/\1\*]/g;

    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const [fullMatch, tag, content] = match;
        const index = match.index;

        // Добавляем текст до тега
        if (index > lastIndex) {
            parts.push(text.slice(lastIndex, index));
        }

        // Рекурсивно парсим содержимое тега (вдруг вложенные теги)
        const children = parseInline(content);

        // Оборачиваем в span с нужным классом
        let className = '';
        switch (tag) {
            case 'underline':
                className = styles['openedFile__content-underline'];
                break;
            case 'bold':
                className = styles['openedFile__content-bold'];
                break;
            case 'italic':
                className = styles['openedFile__content-italic'];
                break;
        }

        parts.push(
            <span key={index} className={className}>
        {children}
      </span>
        );

        lastIndex = index + fullMatch.length;
    }

    // Добавляем остаток текста после последнего тега
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}

export function parseFile(file: string): ReactNode[] {
    const lines = file.split('\n');

    const elements: ReactNode[] = [];

    let i = 0;
    const n = lines.length;

    while (i < n) {
        const line = lines[i].trim();

        // [code*] ... [/code*]
        if (line.startsWith('[code*]')) {
            // Собираем строки до [/code*]
            let codeLines: string[] = [];
            i++; // пропускаем [code*]
            while (i < n && !lines[i].startsWith('[/code*]')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // пропускаем [/code*]

            const codeText = codeLines.join('\n');
            elements.push(
                <div key={`code-${i}`} className={styles['openedFile__content-code']}>
                    <CodeBlock code={codeText}/>
                </div>
            );
            continue;
        }

        // [terminal*] ... [/terminal*]
        if (line.startsWith('[terminal*]')) {
            let terminalLines: string[] = [];
            i++;
            while (i < n && !lines[i].startsWith('[/terminal*]')) {
                terminalLines.push(lines[i]);
                i++;
            }
            i++;

            // Передаём терминальные команды в TerminalBlock
            // Здесь предполагается, что у вас есть парсер для команд
            // Для примера передаём пустой массив или можно передать terminalLines
            elements.push(
                <div key={`terminal-${i}`} className={styles['openedFile__content-terminal']}>
                    <TerminalBlock commands={terminalLines.join('\n')}/>
                </div>
            );
            continue;
        }

        // [/divline*] — рисуем линию
        if (line === '[/divline*]') {
            elements.push(
                <div key={`line-${i}`} className={styles['openedFile__content-line']}/>
            );
            i++;
            continue;
        }

        // [point*] ... [/point*]
        if (line.startsWith('[point*]') && line.endsWith('[/point*]')) {
            const content = line.slice(8, -9).trim();
            elements.push(
                <div key={`point-${i}`} className={styles['openedFile__content-point']}>
                    {content}
                </div>
            );
            i++;
            continue;
        }

        // Обычный текст с возможными inline тегами
        if (line.length > 0) {
            elements.push(
                <div key={`text-${i}`} className={styles['openedFile__content-text']}>
                    {parseInline(line)}
                </div>
            );
            i++;
            continue;
        }

        // Пустая строка — рендерим пустой div для отступа
        elements.push(<div key={`empty-${i}`} style={{height: 8}}/>);
        i++;
    }

    return elements;
}