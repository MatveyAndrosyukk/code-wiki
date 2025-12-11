import {User} from "../../../store/slices/userSlice";

export const isUserCanView = (user: User | null, loggedInUser: User | null) => {
    const isUserOwner = loggedInUser?.roles.some(role => role.value === "OWNER");

    if (isUserOwner) {
        return true;
    }

    const isUserViewBlocked = user?.isViewBlocked ?? false;
    const isUserEditor = user?.whoCanEdit.some(u => u.email === localStorage.getItem('email'));
    const isUserEqualsLoggedIn = user?.email === localStorage.getItem('email');
    if (isUserViewBlocked) {

        return isUserEditor || isUserEqualsLoggedIn;
    }

    return true;
};