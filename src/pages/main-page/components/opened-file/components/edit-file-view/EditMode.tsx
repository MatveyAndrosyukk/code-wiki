import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import styles from './EditMode.module.scss';
import {ReactComponent as BoldImage} from './images/edit-file-view__bold.svg'
import {ReactComponent as ItalicImage} from './images/edit-file-view__italic.svg'
import {ReactComponent as UnderlinedImage} from './images/edit-file-view__underlined.svg'
import {ReactComponent as TerminalImage} from './images/edit-file-view__terminal.svg'
import {ReactComponent as CodeImage} from './images/edit-file-view__code.svg'
import {ReactComponent as CodeLineImage} from './images/edit-file-view__codeLine.svg'
import {ReactComponent as PointImage} from './images/edit-file-view__point.svg'
import {ReactComponent as LineImage} from './images/edit-file-view__line.svg'
import {ReactComponent as LinkImage} from './images/edit-file-view__link.svg'
import {ReactComponent as ImgImage} from './images/edit-file-view__image.svg'
import SwitchWhileEditModal from "../../../../../../ui-components/switch-while-edit-modal/SwitchWhileEditModal";
import {CreateFilePayload} from "../../../../../../store/thunks/files/createFile";
import {uploadImageAsync} from "../../../../../../services/uploadImageAsync";
import {AppContext} from "../../../../../../context/AppContext";
import extractImagesName from "../../../../../../utils/functions/extractImageNames";
import {isUserAdminOrOwner} from "../../../../../../utils/functions/permissions-utils/isUserAdminOrOwner";
import {useDebouncedValue} from "../../../../../../utils/hooks/useDebouncedValue";

interface EditFileViewProps {
    file: CreateFilePayload;
    onSaveEditedFileChanges: (
        newContent: string,
        addedImages: string[],
        onSuccess: () => void) => void,
    onCancelEditedFileChange: (
        addedImages: string[],
        onSuccess: () => void) => void;
    parseFileTextToHTML: (
        content: string,
        onImageClick: (imageUrl: string) => void | null,
        isFileTreeOpened: boolean) => React.ReactNode[],
    isFileTreeOpened: boolean,
    onImageClick: (imageUrl: string) => void | null;
}

const EditMode: React.FC<EditFileViewProps> = (
    {
        file,
        onSaveEditedFileChanges,
        onCancelEditedFileChange,
        parseFileTextToHTML,
        onImageClick,
        isFileTreeOpened,
    }
) => {
    const context = useContext(AppContext);
    if (!context) throw new Error("Component can't be used without context");
    const {fileState, loggedInUser} = context;
    const [textareaContent, setTextareaContent] = useState(file.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [addedImagesWhileEditing, setAddedImagesWhileEditing] = useState<string[]>([]);
    const [amountOfImagesInTextArea, setAmountOfImagesInTextArea] = useState<string[]>([]);
    const [previewContent, setPreviewContent] = useState<React.ReactNode>([]);
    const debouncedTextareaContent = useDebouncedValue(textareaContent, 300);

    useEffect(() => {
        setPreviewContent(parseFileTextToHTML(debouncedTextareaContent, onImageClick, isFileTreeOpened));
    }, [debouncedTextareaContent, onImageClick, parseFileTextToHTML, isFileTreeOpened]);

    const {
        contentError,
        setIsFileContentChanged,
        setContentError,
    } = fileState

    useEffect(() => {
        setAddedImagesWhileEditing(extractImagesName(file.content));
    }, [file.content]);

    useEffect(() => {
        const images = extractImagesName(debouncedTextareaContent);
        setAmountOfImagesInTextArea(images);
    }, [debouncedTextareaContent]);

    useEffect(() => {
        setTextareaContent(file.content);
        setIsFileContentChanged(false);
    }, [file.content, setIsFileContentChanged]);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    useEffect(() => {
        const currentLength = textareaContent.length;
        const imagesLength = amountOfImagesInTextArea.length;

        if (currentLength > 65000 && !isUserAdminOrOwner(loggedInUser)) {
            setContentError(`Your note is too long (${currentLength}/65000).`);
            return;
        }

        if (imagesLength > 5 && !isUserAdminOrOwner(loggedInUser)) {
            setContentError(`You have inserted too many pictures (${imagesLength}/5).`);
        } else {
            setContentError('');
        }
    }, [textareaContent.length, amountOfImagesInTextArea.length, loggedInUser, setContentError]);

    const pasteTag = useCallback((tag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const {selectionStart, selectionEnd, value} = textarea;
        if (selectionStart === null || selectionEnd === null) return;

        const prevScrollTop = textarea.scrollTop;

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
                textarea.scrollTop = prevScrollTop;
            }
        }, 0);
    }, [setTextareaContent, setIsFileContentChanged, textareaRef]);

    const handleSelectImage = useCallback(async (file: File) => {
        if (contentError.includes("You have inserted too many pictures")) {
            return;
        }

        try {
            const data = await uploadImageAsync(file);
            if (data && data.fileName) {
                pasteTag(`[image/${data.fileName}]`);
                setAddedImagesWhileEditing(prev => [...prev, data.fileName]);
            }
        } catch (error) {
            console.error("Failed to upload image:", error);
        }
    }, [contentError, pasteTag]);

    const handleOpenFileDialog = useCallback(() => {
        fileInputRef.current?.click();
    }, [fileInputRef]);

    const changeFileHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            handleSelectImage(file).then(() => {
                e.target.value = "";
            });
        }
    }, [handleSelectImage]);

    const handleChangeTextareaContent = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaContent(e.target.value);
        setIsFileContentChanged(e.target.value !== file.content);
    }, [file.content, setIsFileContentChanged]);

    const wrapSelection = useCallback((tagStart: string, tagEnd: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const {selectionStart, selectionEnd, value} = textarea;
        if (selectionStart === null || selectionEnd === null) return;

        const prevScrollTop = textarea.scrollTop;

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
    }, [setTextareaContent, setIsFileContentChanged, textareaRef]);

    return (
        <div className={styles['edit-mode']}>
            <div className={styles['edit-mode__header']}>
                <div className={styles['header__edit-buttons']}>
                    <div
                        title='Bold'
                        onClick={() => {
                            wrapSelection('[`b`]', '[`/b`]')
                        }}>
                        <BoldImage style={{width: '10.45px', height: '12.57px'}}/>
                    </div>
                    <div
                        title='Italic'
                        onClick={() => {
                            wrapSelection('[`i`]', '[`/i`]')
                        }}>
                        <ItalicImage style={{width: '9px', height: '10.83px'}}/>
                    </div>
                    <div
                        title='Underlined'
                        onClick={() => {
                            wrapSelection('[`u`]', '[`/u`]')
                        }}>
                        <UnderlinedImage style={{width: '10.45px', height: '12.57px'}}/>
                    </div>
                    <div
                        title='Point'
                        onClick={() => {
                            wrapSelection('[`p`]\n', '\n[`/p`]')
                        }}>
                        <PointImage style={{width: '4px', height: '4px'}}/>
                    </div>
                    <div
                        title='Link'
                        onClick={() => {
                            wrapSelection('[`l to="https://example.com"`]', '[`/l`]')
                        }}>
                        <LinkImage style={{width: '14px', height: '14px'}}/>
                    </div>
                    <div
                        title='Code'
                        onClick={() => {
                            wrapSelection('[`c`]\n', '\n[`/c`]')
                        }}>
                        <CodeImage style={{width: '16.32px', height: '14.57px'}}/>
                    </div>
                    <div
                        title='Code line'
                        onClick={() => {
                            wrapSelection('[`lc`]', '[`/lc`]')
                        }}>
                        <CodeLineImage style={{width: '16px', height: '16px'}}/>
                    </div>
                    <div
                        title='Terminal'
                        onClick={() => {
                            wrapSelection('[`t`]\n', '\n[`/t`]')
                        }}>
                        <TerminalImage style={{width: '14.25px', height: '12.67px'}}/>
                    </div>
                    <div
                        title='Line'
                        onClick={() => {
                            pasteTag('[`l`]')
                        }}>
                        <LineImage style={{width: '14.25px', height: '1.81px'}}/>
                    </div>
                    <div
                        title='Image'
                        onClick={handleOpenFileDialog}>
                        <ImgImage/>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        ref={fileInputRef}
                        onChange={changeFileHandler}
                    />
                </div>
                <div className={styles['header__action-buttons']}>
                    <button
                        className={styles['header__action-buttons-save']}
                        onClick={() => onSaveEditedFileChanges(
                            textareaContent,
                            addedImagesWhileEditing,
                            () => setAddedImagesWhileEditing([]))}>Save
                    </button>
                    <button
                        onClick={() => onCancelEditedFileChange(
                            addedImagesWhileEditing,
                            () => setAddedImagesWhileEditing([]))}
                        className={styles['header__action-buttons-cancel']}>Cancel
                    </button>
                </div>
            </div>
            <div className={styles['edit-mode__body']}>
                    <textarea
                        ref={textareaRef}
                        className={styles['body__textarea']}
                        value={textareaContent}
                        onChange={handleChangeTextareaContent}
                    />
                <div className={styles['edit-mode__error']}>{contentError}</div>
                <div className={styles['body__preview']}>
                    <div className={styles['body__preview-title']}>Preview</div>
                    <div
                        className={styles['body__preview-content']}>{previewContent}</div>
                </div>
            </div>
            <SwitchWhileEditModal
                onCancelEditedFileChange={onCancelEditedFileChange}
                addedImagesWhileEditing={addedImagesWhileEditing}
                onSuccessCanceling={() => setAddedImagesWhileEditing([])}/>
        </div>
    );
};

export default EditMode;