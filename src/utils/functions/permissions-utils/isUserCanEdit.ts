import {User} from "../../../store/slices/userSlice";

export const isUserCanEdit = (
    isLoggedIn: boolean,
    emailParam: string | undefined,
    user: User | null,
    loggedInUser: User | null,
) => {
    if (!isLoggedIn && !emailParam) {
        return true
    }

    const isUserOwner = loggedInUser?.roles.some(role => role.value === "OWNER");

    if (isUserOwner) {
        return true;
    }

    const isUserEditor = user?.whoCanEdit.some(user => user.email === localStorage.getItem('email'));
    const isUserEqualsLoggedIn = user?.email === localStorage.getItem('email');
    return isUserEditor || isUserEqualsLoggedIn;

}