import React from 'react';
import './App.scss';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPageWrapper from "./pages/main-page/MainPageWrapper";
import VerifyPage from "./pages/verify-page/VerifyPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPageWrapper/>}/>
                <Route path="/:email" element={<MainPageWrapper/>}/>
                <Route path="/verify" element={<VerifyPage/>}/>
                <Route path="/resetPassword" element={<MainPageWrapper/>}/>
            </Routes>
        </Router>
    );
}

export default App;
