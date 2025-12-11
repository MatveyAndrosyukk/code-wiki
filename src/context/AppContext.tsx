import {createContext, FC, ReactNode} from "react";
import useAuthorizationActions, {AuthorizationState} from "../utils/hooks/useAuthorizationActions";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {User} from "../store/slices/userSlice";
import {CreateFilePayload} from "../store/thunks/files/createFile";
import useFileActions, {FileActionsState} from "../utils/hooks/useFileActions";
import useBanActions, {BanState} from "../utils/hooks/useBanActions";

export interface AppProviderState {
    authState: AuthorizationState;
    viewedUser: User | null;
    loggedInUser: User | null;
    files: CreateFilePayload[];
    fileState: FileActionsState;
    banState: BanState;
}

export interface AppProviderProps {
    children: ReactNode;
}

export const AppContext = createContext<AppProviderState | null>(null);

export const AppProvider: FC<AppProviderProps> = ({children}) => {
    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);
    const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser);
    const files = useSelector((state: RootState) => state.fileTree.files);
    const authState = useAuthorizationActions();
    const fileState = useFileActions(files, viewedUser);
    const banState = useBanActions(viewedUser);

    return (
        <AppContext.Provider value={{authState, viewedUser, loggedInUser, files, fileState, banState}}>
            {children}
        </AppContext.Provider>
    );
};
