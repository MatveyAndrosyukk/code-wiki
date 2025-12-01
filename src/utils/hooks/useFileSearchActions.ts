import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {SearchType} from "../../types/searchType";
import {openPathToNode} from "../../store/slices/fileTreeSlice";
import {useDispatch} from "react-redux";

export interface FileSearchState {
    searchType: SearchType;
    setSearchType: Dispatch<SetStateAction<SearchType>>;
    handleOpenPathToSelectedFile: (id: number) => void;
    handleSwitchSearchType: () => void;
}

export default function useFileSearchActions(): FileSearchState {
    const dispatch = useDispatch();
    const [searchType, setSearchType] = useState<SearchType>(SearchType.InFileNames);

    const handleOpenPathToSelectedFile = useCallback((id: number) => {
        dispatch(openPathToNode({ id }));
    }, [dispatch]);

    const handleSwitchSearchType = useCallback(() => {
        if (searchType === SearchType.InFileNames) {
            setSearchType(SearchType.InFileContents);
        } else {
            setSearchType(SearchType.InFileNames);
        }
    }, [searchType, setSearchType]);

    return {
        searchType,
        setSearchType,
        handleOpenPathToSelectedFile,
        handleSwitchSearchType,
    }
}