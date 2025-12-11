import {ChangeEvent, Dispatch, Ref, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {User} from "../../store/slices/userSlice";
import {banUserByReasonAsync} from "../../services/banUserByReasonAsync";
import {unbanUserByReasonAsync} from "../../services/unbanUserAsync";

export enum BanMode {
    ban = "ban",
    unban = "unban"
}

export interface BanState {
    isBanModalOpened: boolean;
    setIsBanModalOpened: Dispatch<SetStateAction<boolean>>;
    banModalInputRef: Ref<HTMLInputElement | null> | null;
    banModalValue: string;
    setBanModalValue: Dispatch<SetStateAction<string>>;
    banModalLoading: boolean;
    setBanModalLoading: Dispatch<SetStateAction<boolean>>;
    banModalError: string;
    setBanModalError: Dispatch<SetStateAction<string>>;
    banModalMessage: string;
    setBanModalMessage: Dispatch<SetStateAction<string>>;
    banModalMode: BanMode;
    setBanModalMode: Dispatch<SetStateAction<BanMode>>;
    handleCloseBanModal: () => void;
    handleChangeBanModalValue: (e: ChangeEvent<HTMLInputElement>) => void;
    handleBanUser: () => void;
    handleSwitchBanMode: () => void;
    getButtonText: () => string;
    handleBanOrUnbanUser: () => void;
}

export default function useBanActions(viewedUser: User | null): BanState {
    const [isBanModalOpened, setIsBanModalOpened] = useState<boolean>(false);
    const banModalInputRef = useRef<HTMLInputElement>(null);
    const [banModalValue, setBanModalValue] = useState<string>('')
    const [banModalLoading, setBanModalLoading] = useState<boolean>(false);
    const [banModalError, setBanModalError] = useState<string>('')
    const [banModalMessage, setBanModalMessage] = useState<string>('')
    const [banModalMode, setBanModalMode] = useState<BanMode>(BanMode.ban);

    useEffect(() => {
        if (isBanModalOpened && banModalInputRef.current) {
            banModalInputRef.current.focus();
        }
    }, [isBanModalOpened])


    const handleUnbanUser = useCallback(async () => {
        setBanModalLoading(true);
        if (viewedUser?.id) {
            try {
                await unbanUserByReasonAsync(viewedUser.email)
                    .then(() => {
                        setBanModalError('')
                        setBanModalMessage('User was successfully unbanned.');
                        setBanModalValue('');
                    })
                    .catch((error) => {
                        setBanModalMessage('')
                        setBanModalError(error.message);
                    })
            } finally {
                setBanModalLoading(false);
            }
        }
    }, [viewedUser?.email, viewedUser?.id])

    const handleSwitchBanMode = useCallback(() => {
        if (banModalMode === BanMode.ban) {
            setBanModalMode(BanMode.unban);
        } else {
            setBanModalMode(BanMode.ban)
        }
        setBanModalError('')
        setBanModalMessage('')
    }, [banModalMode])

    const handleCloseBanModal = useCallback(() => {
        setIsBanModalOpened(false);
        setBanModalMessage('');
        setBanModalError('');
        setBanModalValue('');
        setBanModalMode(BanMode.ban);
    }, []);

    const handleChangeBanModalValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setBanModalValue(e.target.value);
    }, [])

    const handleBanUser = useCallback(async () => {
        const banReason = banModalValue.trim();
        if (!banReason) {
            setBanModalError('Ban reason is required');
            return;
        }
        setBanModalLoading(true);
        if (viewedUser?.id) {
            try {
                await banUserByReasonAsync({
                    email: viewedUser.email,
                    banReason: banReason,
                })
                    .then(() => {
                        setBanModalError('')
                        setBanModalMessage('User was successfully banned.');
                        setBanModalValue('');
                    })
                    .catch((error) => {
                        setBanModalMessage('')
                        setBanModalError(error.message);
                    })
            } finally {
                setBanModalLoading(false);
            }
        }
    }, [banModalValue, viewedUser])

    const handleBanOrUnbanUser = useCallback(() => {
        if (banModalMode === BanMode.ban) {
            handleBanUser().catch(console.error);
        } else {
            handleUnbanUser().catch(console.error);
        }
    }, [banModalMode, handleBanUser, handleUnbanUser])

    const getButtonText = () => {
        if (banModalMode === BanMode.ban) {
            return banModalLoading ? 'Ban...' : 'Ban';
        } else {
            return banModalLoading ? 'Unban...' : 'Unban';
        }
    };


    return {
        isBanModalOpened,
        setIsBanModalOpened,
        banModalInputRef,
        banModalValue,
        setBanModalValue,
        banModalLoading,
        setBanModalLoading,
        banModalError,
        setBanModalError,
        banModalMessage,
        setBanModalMessage,
        banModalMode,
        setBanModalMode,
        handleCloseBanModal,
        handleChangeBanModalValue,
        handleBanUser,
        handleSwitchBanMode,
        handleBanOrUnbanUser,
        getButtonText
    }
}