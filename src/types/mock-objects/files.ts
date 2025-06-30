import {File, FileStatus, FileType} from "../file";

export const files: File[] = [
    {
        id: 1,
        type: FileType.Folder,
        name: "Documents",
        content: "",
        status: FileStatus.Closed,
        likes: 3,
        author: "alice",
        children: [
            {
                id: 2,
                type: FileType.Folder,
                name: "Clients",
                content: "",
                status: FileStatus.Closed,
                likes: 1,
                author: "bob",
                children: [
                    {
                        id: 3,
                        type: FileType.Folder,
                        name: "Acme Inc",
                        content: "",
                        status: FileStatus.Closed,
                        likes: 4,
                        author: "charlie",
                        children: [
                            {
                                id: 4,
                                type: FileType.Folder,
                                name: "Project A",
                                content: "",
                                status: FileStatus.Closed,
                                likes: 2,
                                author: "dave",
                                children: [
                                    {
                                        id: 5,
                                        type: FileType.File,
                                        name: "document.txt",
                                        content: "Hello, this is your [underline*]preview file 1[/underline*] to see how your future notes will be look like. Let’s create some [bold*]code[/bold*] to show how [italic*]comfortably[/italic*] you can save your code notes in CodeWiki:\\n[code*]\\nimport React, {FC, useEffect, useRef} from 'react';\\nimport hljs from 'highlight.js';\\nimport 'highlight.js/styles/code.css';\\n\\ninterface CodeBlockProps {\\n    code: string;\\n}\\n\\nconst CodeBlock: FC<CodeBlockProps> = ({code}) => {\\n    const codeRef = useRef(null);\\n    useEffect(() => {\\n        if (codeRef.current) {\\n            hljs.highlightElement(codeRef.current)\\n        }\\n    }, [])\\n\\n    return (\\n        <pre\\n            style={{\\n                maxHeight: 500,\\n                overflowY: 'auto',\\n                borderRadius: '6px',\\n                scrollbarWidth: 'thin',\\n                scrollbarColor: '#8D9191 #191A1A',\\n            }}>\\n            <code\\n                style={{\\n                    whiteSpace: 'pre',\\n                    display: 'block'\\n                }} ref={codeRef}>\\n                {code}\\n            </code>\\n        </pre>\\n    );\\n};\\n\\nexport default CodeBlock;\\n[/code*]\\n[/divline*]\\nNow let’s watch, how your console notes will be saved in Instanotes:\\n[terminal*]\\nC:\\\\Users\\\\matve> ping 192.168.1.1\\nОбмен пакетами с 192.168.1.1 по с 32 байтами данных:\\nПревышен интервал ожидания для запроса.\\nПревышен интервал ожидания для запроса.\\nСтатистика Ping для 192.168.1.1:\\n    Пакетов: отправлено = 2, получено = 0, потеряно = 2\\n    (100% потерь)\\nControl-C\\n^C\\nC:\\\\Users\\\\matve> \\n[/terminal*]\\nPoints:\\n[point*]Point 1[/point*]\\n[point*]Point 2[/point*]\\n[point*]Point 3[/point*]\\nTasks:\\n[x]Купить крамбл куки\\n[ ]Купить крамбл куки\\n[ ]Купить крамбл куки\\n",
                                        status: FileStatus.Closed,
                                        likes: 5,
                                        author: "eve",
                                        children: [],
                                    },
                                    {
                                        id: 6,
                                        type: FileType.File,
                                        name: "document2.txt",
                                        content: "Hello, this is your preview file 3 to see how your future notes will be look like. Let’s create some code to show how comfortably you can save your code notes in CodeWiki:\n" +
                                            "[code*]\n" +
                                            "import React from 'react';\n" +
                                            "import {File, FileStatus, FileType} from \"../../../../../../types/file\";\n" +
                                            "import OpenedImg from './images/file-list-opened.svg'\n" +
                                            "import ClosedImg from './images/file-list-closed.svg'\n" +
                                            "import FileImg from './images/file-list-file.svg'\n" +
                                            "import Line from './images/file-list-line.svg'\n" +
                                            "import ChildLine from './images/file-list-child-line.svg'\n" +
                                            "import LastChildLine from './images/file-list-last-child-line.svg'\n" +
                                            "import styles from './FileList.module.css'\n" +
                                            "import {useDispatch} from \"react-redux\";\n" +
                                            "import {toggleFolder} from \"../../../../../../store/slices/fileTreeSlice\";\n" +
                                            "\n" +
                                            "interface FileListProps {\n" +
                                            "    files: File[];\n" +
                                            "    onFileClick: (id: number) => void;\n" +
                                            "}\n" +
                                            "\n" +
                                            "const FileList: React.FC<FileListProps> = ({ files, onFileClick }) => {\n" +
                                            "    const dispatch = useDispatch();\n" +
                                            "\n" +
                                            "    // При нажатии на папку вызывается slice открытия/закрытия папки.\n" +
                                            "    const onFolderClick = (id: number) => {\n" +
                                            "        dispatch(toggleFolder({id}))\n" +
                                            "    };\n" +
                                            "\n" +
                                            "    // Вся логика отрисовки файлов/папок.\n" +
                                            "    const renderTree = (\n" +
                                            "        nodes: File[],\n" +
                                            "        level = 0,\n" +
                                            "        ancestors: boolean[] = []\n" +
                                            "    ) => {\n" +
                                            "        return nodes.map((node, idx) => {\n" +
                                            "            const isLast = idx === nodes.length - 1;\n" +
                                            "\n" +
                                            "            // Логика отрисовки нужных линий перед файлом/папкой.\n" +
                                            "            const linesBlock = (\n" +
                                            "                // Пропуск 1 элемента, для него line не нужна.\n" +
                                            "                <span className={styles['fileList__node-lineBlock']}>\n" +
                                            "                {ancestors.slice(1).map((hasSibling, i) =>\n" +
                                            "                    hasSibling ? (\n" +
                                            "                        <img\n" +
                                            "                            className={styles['fileList__node-line']}\n" +
                                            "                            key={i}\n" +
                                            "                            src={Line}\n" +
                                            "                            alt=\"line\"\n" +
                                            "                            style={{\n" +
                                            "                                marginLeft: i === 0 ? 3 : 11,\n" +
                                            "                                marginRight: 10,\n" +
                                            "                            }}\n" +
                                            "                        />\n" +
                                            "                    ) : (\n" +
                                            "                        <span\n" +
                                            "                            key={i}\n" +
                                            "                            className={styles['fileList__node-space']}\n" +
                                            "                            style={{\n" +
                                            "                                marginLeft: i === 0 ? 3 : 11,\n" +
                                            "                            }}\n" +
                                            "                        />\n" +
                                            "                    )\n" +
                                            "                )}\n" +
                                            "                    {level > 0 && (\n" +
                                            "                        <img\n" +
                                            "                            className={styles['fileList__node-line']}\n" +
                                            "                            src={\n" +
                                            "                                nodes.length === 1\n" +
                                            "                                    ? LastChildLine\n" +
                                            "                                    : idx === 0\n" +
                                            "                                        ? ChildLine\n" +
                                            "                                        : isLast\n" +
                                            "                                            ? LastChildLine\n" +
                                            "                                            : Line\n" +
                                            "                            }\n" +
                                            "                            alt=\"line\"\n" +
                                            "                            style={{\n" +
                                            "                                marginLeft: ancestors.length === 1 ? 3 : 11,\n" +
                                            "                                marginRight: 10,\n" +
                                            "                            }}\n" +
                                            "                        />\n" +
                                            "                    )}\n" +
                                            "            </span>\n" +
                                            "            );\n" +
                                            "\n" +
                                            "            return (\n" +
                                            "                // Корневой div для файла/папки первого уровня.\n" +
                                            "                <div\n" +
                                            "                    className={styles['fileList__node']}\n" +
                                            "                    style={{ marginLeft: 0 }}\n" +
                                            "                    key={node.id}\n" +
                                            "                >\n" +
                                            "                    {/*Контейнер для каждого файла/папки (линии, статус, название)*/}\n" +
                                            "                    <div className={styles['fileList__node-container']}>\n" +
                                            "                        {linesBlock}\n" +
                                            "                        {node.type === FileType.Folder ? (\n" +
                                            "                            <div\n" +
                                            "                                className={styles['fileList__node-folder']}\n" +
                                            "                                onClick={() => onFolderClick(node.id)}\n" +
                                            "                                style={{ display: 'flex', alignItems: 'center' }}\n" +
                                            "                            >\n" +
                                            "                                <img\n" +
                                            "                                    src={node.status === FileStatus.Opened ? OpenedImg : ClosedImg}\n" +
                                            "                                    alt=\"File Status\"\n" +
                                            "                                />\n" +
                                            "                                {node.name}\n" +
                                            "                            </div>\n" +
                                            "                        ) : (\n" +
                                            "                            <div className={styles['fileList__node-file']}\n" +
                                            "                                 style={{fontWeight: node.status === FileStatus.Opened ? 'bold' : 'normal'}}\n" +
                                            "                                 onClick={() => onFileClick(node.id)}\n" +
                                            "                            >\n" +
                                            "                                <img src={FileImg} alt=\"File\" /> {node.name}\n" +
                                            "                            </div>\n" +
                                            "                        )}\n" +
                                            "                    </div>\n" +
                                            "                    {/*Отрисовка всех children для папки*/}\n" +
                                            "                    {node.type === FileType.Folder &&\n" +
                                            "                        node.status === FileStatus.Opened &&\n" +
                                            "                        node.children &&\n" +
                                            "                        renderTree(\n" +
                                            "                            node.children,\n" +
                                            "                            level + 1,\n" +
                                            "                            [...ancestors, !isLast]\n" +
                                            "                        )}\n" +
                                            "                </div>\n" +
                                            "            );\n" +
                                            "        });\n" +
                                            "    };\n" +
                                            "\n" +
                                            "    return <div className={styles['fileList']}>{renderTree(files)}</div>;\n" +
                                            "};\n" +
                                            "\n" +
                                            "export default FileList;\n" +
                                            "[/code*]\n" +
                                            "[/divline*]\n" +
                                            "Now let’s watch, how your console notes will be saved in Instanotes:\n" +
                                            "[terminal*]\n" +
                                            "PS C:\\Users\\matve> ping 192.168.1.1\n" +
                                            "\n" +
                                            "Обмен пакетами с 192.168.1.1 по с 32 байтами данных:\n" +
                                            "Превышен интервал ожидания для запроса.\n" +
                                            "\n" +
                                            "Статистика Ping для 192.168.1.1:\n" +
                                            "    Пакетов: отправлено = 1, получено = 0, потеряно = 1\n" +
                                            "    (100% потерь)\n" +
                                            "Control-C\n" +
                                            "PS C:\\Users\\matve>\n" +
                                            "[/terminal*]\n" +
                                            "Points:\n" +
                                            "[point*]Point 1[/point*]\n" +
                                            "[point*]Point 2[/point*]\n" +
                                            "[point*]Point 3[/point*]\n",
                                        status: FileStatus.Closed,
                                        likes: 0,
                                        author: "frank",
                                        children: [],
                                    },
                                ],
                            },
                            {
                                id: 7,
                                type: FileType.Folder,
                                name: "Project B",
                                content: "",
                                status: FileStatus.Closed,
                                likes: 1,
                                author: "grace",
                                children: [
                                    {
                                        id: 8,
                                        type: FileType.File,
                                        name: "document3.txt",
                                        content: "Hello, this is your [underline*]preview file 3[/underline*] to see how your future notes will be look like. Let’s create some [bold*]code[/bold*] to show how [italic*]comfortably[/italic*] you can save your code notes in CodeWiki:\\n[code*]\\nimport React, {FC, useEffect, useRef} from 'react';\\nimport hljs from 'highlight.js';\\nimport 'highlight.js/styles/code.css';\\n\\ninterface CodeBlockProps {\\n    code: string;\\n}\\n\\nconst CodeBlock: FC<CodeBlockProps> = ({code}) => {\\n    const codeRef = useRef(null);\\n    useEffect(() => {\\n        if (codeRef.current) {\\n            hljs.highlightElement(codeRef.current)\\n        }\\n    }, [])\\n\\n    return (\\n        <pre\\n            style={{\\n                maxHeight: 500,\\n                overflowY: 'auto',\\n                borderRadius: '6px',\\n                scrollbarWidth: 'thin',\\n                scrollbarColor: '#8D9191 #191A1A',\\n            }}>\\n            <code\\n                style={{\\n                    whiteSpace: 'pre',\\n                    display: 'block'\\n                }} ref={codeRef}>\\n                {code}\\n            </code>\\n        </pre>\\n    );\\n};\\n\\nexport default CodeBlock;\\n[/code*]\\n[/divline*]\\nNow let’s watch, how your console notes will be saved in Instanotes:\\n[terminal*]\\nC:\\\\Users\\\\matve> ping 192.168.1.1\\nОбмен пакетами с 192.168.1.1 по с 32 байтами данных:\\nПревышен интервал ожидания для запроса.\\nПревышен интервал ожидания для запроса.\\nСтатистика Ping для 192.168.1.1:\\n    Пакетов: отправлено = 2, получено = 0, потеряно = 2\\n    (100% потерь)\\nControl-C\\n^C\\nC:\\\\Users\\\\matve> \\n[/terminal*]\\nPoints:\\n[point*]Point 1[/point*]\\n[point*]Point 2[/point*]\\n[point*]Point 3[/point*]\\nTasks:\\n[x]Купить крамбл куки\\n[ ]Купить крамбл куки\\n[ ]Купить крамбл куки\\n",
                                        status: FileStatus.Closed,
                                        likes: 3,
                                        author: "heidi",
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 9,
                type: FileType.Folder,
                name: "Honey Factory",
                content: "",
                status: FileStatus.Closed,
                likes: 2,
                author: "ivan",
                children: [],
            },
        ],
    },
];