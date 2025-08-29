import React from 'react';
import {useParams} from "react-router-dom";
import MainPage from "./MainPage";

const MainPageWrapper = () => {
    const {email} = useParams<{email: string}>();

    return <MainPage emailParam={email} />
};

export default MainPageWrapper;