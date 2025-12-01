import {User} from "../../../store/slices/userSlice";

export const isUserEqualsLoggedIn = (
    emailParam: string | undefined,
    isLoggedIn: boolean,
    user: User | null
) => {
    if (!emailParam && !isLoggedIn) {
        return false;
    }
    return user?.email !== localStorage.getItem('email');

}