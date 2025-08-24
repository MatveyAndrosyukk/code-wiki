import {useState} from "react";
import {SearchType} from "../../types/searchType";
import {openPathToNode} from "../../store/slices/fileTreeSlice";
import {useDispatch} from "react-redux";

export default function useFileSearch(){
    const [searchType, setSearchType] = useState<SearchType>(SearchType.InFileNames);
    const dispatch = useDispatch();

    const selectHandler = (id: number) => {
        dispatch(openPathToNode({ id }));
    };

    const changeSearchTypeHandler = () => {
        if (searchType === SearchType.InFileNames){
            setSearchType(SearchType.InFileContents);
        } else {
            setSearchType(SearchType.InFileNames);
        }
    }

    return {
        searchType,
        setSearchType,
        selectHandler,
        onChangeSearchType: changeSearchTypeHandler,
    }
}