import React from 'react';
import {useLocation, useParams} from "react-router-dom";
import MainPage from "./MainPage";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const MainPageWrapper = () => {
    const query = useQuery()
    const token = query.get("token") || undefined;

    const {email} = useParams<{ email: string }>();

    return <MainPage
        resetToken={token}
        emailParam={email}/>
};

export default MainPageWrapper;