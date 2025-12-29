import {User} from "../../../store/slices/userSlice";

export const isUserAdminOrOwner = (
    loggedInUser: User | null,
) => {
    const isUserAdminOrOwner = loggedInUser?.roles.some(role => role.value === "ADMIN");

    return !!isUserAdminOrOwner;

}