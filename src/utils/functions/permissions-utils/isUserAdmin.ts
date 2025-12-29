import {User} from "../../../store/slices/userSlice";

export const isUserAdmin = (
    loggedInUser: User | null,
) => {
    const isUserAdmin = loggedInUser?.roles.some(role => role.value === "ADMIN");

    return !!isUserAdmin;

}