import {File, FileStatus, FileType} from "../file";

export const file: File = {
    id: 5,
    type: FileType.File,
    name: 'document.txt',
    content: "Hello, this is your [underline*]preview file 1[/underline*] to see how your future notes will be look like. Let’s create some [bold*]code[/bold*] to show how [italic*]comfortably[/italic*] you can save your code notes in CodeWiki:\n[code*]\nimport React, {FC, useEffect, useRef} from 'react';\nimport hljs from 'highlight.js';\nimport 'highlight.js/styles/code.css';\n\ninterface CodeBlockProps {\n    code: string;\n}\n\nconst CodeBlock: FC<CodeBlockProps> = ({code}) => {\n    const codeRef = useRef(null);\n    useEffect(() => {\n        if (codeRef.current) {\n            hljs.highlightElement(codeRef.current)\n        }\n    }, [])\n\n    return (\n        <pre\n            style={{\n                maxHeight: 500,\n                overflowY: 'auto',\n                borderRadius: '6px',\n                scrollbarWidth: 'thin',\n                scrollbarColor: '#8D9191 #191A1A',\n            }}>\n            <code\n                style={{\n                    whiteSpace: 'pre',\n                    display: 'block'\n                }} ref={codeRef}>\n                {code}\n            </code>\n        </pre>\n    );\n};\n\nexport default CodeBlock;\n[/code*]\n[/divline*]\nNow let’s watch, how your console notes will be saved in Instanotes:\n[terminal*]\nC:\\Users\\matve> ping 192.168.1.1\nОбмен пакетами с 192.168.1.1 по с 32 байтами данных:\nПревышен интервал ожидания для запроса.\nПревышен интервал ожидания для запроса.\nСтатистика Ping для 192.168.1.1:\n    Пакетов: отправлено = 2, получено = 0, потеряно = 2\n    (100% потерь)\nControl-C\n^C\nC:\\Users\\matve> \n[/terminal*]\nPoints:\n[point*]Point 1[/point*]\n[point*]Point 2[/point*]\n[point*]Point 3[/point*]\nTasks:\n[x]Купить крамбл куки\n[ ]Купить крамбл куки\n[ ]Купить крамбл куки\n",
    status: FileStatus.Closed,
    children: [],
    likes: 1,
    author: 'matveyhf@gmail.com'
}