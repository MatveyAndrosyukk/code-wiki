import React, {useEffect, useRef, useState} from 'react';
import styles from './EditFileView.module.css';
import {File} from "../../../../../../types/file";
import BoldImage from './images/edit-file-view__bold.svg'
import ItalicImage from './images/edit-file-view__italic.svg'
import UnderlinedImage from './images/edit-file-view__underlined.svg'
import TerminalImage from './images/edit-file-view__terminal.svg'
import CodeImage from './images/edit-file-view__code.svg'
import PointImage from './images/edit-file-view__point.svg'
import LineImage from './images/edit-file-view__line.svg'
import LinkImage from './images/edit-file-view__link.svg'
import SwitchWhileEditModal from "../../../../../../ui-components/switch-while-edit-modal/SwitchWhileEditModal";
import {CreateFilePayload} from "../../../../../../store/thunks/createFileOnServer";

interface EditFileViewProps {
    file: CreateFilePayload;
    onSaveEditedFileChanges: (newContent: string) => void;
    onCancelEditedFileChange: () => void;
    isTryToSwitchWhileEditing: boolean;
    setIsFileContentChanged: (value: boolean) => void;
    onConfirmSwitch: () => void;
    onRejectSwitch: () => void;
    parseFileTextToHTML: (content: string) => React.ReactNode[];
}

const EditFileView: React.FC<EditFileViewProps> = (
    {
        file,
        onSaveEditedFileChanges,
        onCancelEditedFileChange,
        isTryToSwitchWhileEditing,
        setIsFileContentChanged,
        onConfirmSwitch,
        onRejectSwitch,
        parseFileTextToHTML,
    }
) => {
    const [textareaContent, setTextareaContent] = useState(file.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setTextareaContent(file.content);
        setIsFileContentChanged(false);
    }, [file.content, file.id, setIsFileContentChanged]);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaContent(e.target.value);
        setIsFileContentChanged(e.target.value !== file.content);
    };

    const wrapSelection = (tagStart: string, tagEnd: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const {selectionStart, selectionEnd, value} = textarea;
        if (selectionStart === null || selectionEnd === null) return;

        const prevScrollTop = textarea.scrollTop

        const before = value.substring(0, selectionStart);
        const selected = value.substring(selectionStart, selectionEnd);
        const after = value.substring(selectionEnd);

        const newText = before + tagStart + selected + tagEnd + after;
        setTextareaContent(newText);
        setIsFileContentChanged(true);

        const cursorStart = selectionStart + tagStart.length;
        const cursorEnd = cursorStart + selected.length;

        setTimeout(() => {
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(cursorStart, cursorEnd);
                textarea.scrollTop = prevScrollTop;
            }
        }, 0);
    };

    const pasteTag = (tag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const {selectionStart, selectionEnd, value} = textarea;
        if (selectionStart === null || selectionEnd === null) return;

        const prevScrollTop = textarea.scrollTop

        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);

        const newText = before + tag + after;
        setTextareaContent(newText);
        setIsFileContentChanged(true);

        const cursorStart = selectionStart;
        const cursorEnd = cursorStart + tag.length;
        setTimeout(() => {
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(cursorStart, cursorEnd);
                textarea.scrollTop = prevScrollTop
            }
        }, 0);


    }

    return (
        <div className={styles['editFileView']}>
            <div className={styles['editFileView__header']}>
                <div className={styles['editFileView__header-edit']}>
                    <div onClick={() => {
                        wrapSelection('[```b```]', '[```/b```]')
                    }}>
                        <img src={BoldImage} alt='Bold' style={{width: '10.45px', height: '12.57px'}}/>
                    </div>
                    <div onClick={() => {
                        wrapSelection('[```i```]', '[```/i```]')
                    }}>
                        <img src={ItalicImage} alt='Italic' style={{width: '9px', height: '10.83px'}}/>
                    </div>
                    <div onClick={() => {
                        wrapSelection('[```u```]', '[```/u```]')
                    }}>
                        <img src={UnderlinedImage} alt='Underlined' style={{width: '10.45px', height: '12.57px'}}/>
                    </div>
                    <div onClick={() => {
                        wrapSelection('[```point```]\n', '\n[```/point```]')
                    }}>
                        <img src={PointImage} alt='Point' style={{width: '4px', height: '4px'}}/>
                    </div>
                    <div onClick={() => {
                        wrapSelection('[```l to="https://example.com"```]', '[```/l```]')
                    }}>
                        <img src={LinkImage} alt='Link' style={{width: '14px', height: '14px'}}/>
                    </div>
                    <div onClick={() => {
                        wrapSelection('[```code```]\n', '\n[```/code```]')
                    }}>
                        <img src={CodeImage} alt='Code' style={{width: '16.32px', height: '14.57px'}}/>
                    </div>
                    <div onClick={() => {
                        wrapSelection('[```terminal```]\n', '\n[```/terminal```]')
                    }}>
                        <img src={TerminalImage} alt='Terminal' style={{width: '14.25px', height: '12.67px'}}/>
                    </div>
                    <div onClick={() => {
                        pasteTag('[```line```]')
                    }}>
                        <img src={LineImage} alt='Line' style={{width: '14.25px', height: '1.81px'}}/>
                    </div>
                </div>
                <div className={styles['editFileView__header-buttons']}>
                    <button
                        className={styles['editFileView__header-save']}
                        onClick={() => onSaveEditedFileChanges(textareaContent)}
                        disabled={!setIsFileContentChanged}>Save
                    </button>
                    <button
                        onClick={onCancelEditedFileChange}
                        className={styles['editFileView__header-cancel']}>Cancel
                    </button>
                </div>
            </div>
            <div className={styles['editFileView__body']}>
                <textarea
                    ref={textareaRef}
                    className={styles['editFileView__textarea']}
                    value={textareaContent}
                    onChange={handleChange}
                />
                <div className={styles['editFileView__preview']}>
                    <div className={styles['editFileView__preview-title']}>Preview</div>
                    <div className={styles['editFileView__preview-content']}>{parseFileTextToHTML(textareaContent)}</div>
                </div>
            </div>

            <SwitchWhileEditModal
                isTryToSwitchWhileEditing={isTryToSwitchWhileEditing}
                onRejectSwitch={onRejectSwitch}
                onConfirmSwitch={onConfirmSwitch}
            />
        </div>
    );
};

export default EditFileView;