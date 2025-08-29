import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPageWrapper from "./pages/main-page/MainPageWrapper";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPageWrapper/>}/>
                <Route path="/:email" element={<MainPageWrapper/>}/>
            </Routes>
        </Router>
    );
}

export default App;
