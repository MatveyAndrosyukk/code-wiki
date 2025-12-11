import {User} from "../../../store/slices/userSlice";

export const isUserOwner = (
    loggedInUser: User | null,
) => {
    const isUserOwner = loggedInUser?.roles.some(role => role.value === "OWNER");

    return !!isUserOwner;

}